package main

import (
	"os"
	"os/signal"
	"syscall"
)

// shutdownRequestChannel is used to initiate shutdown from one of the
// subsystems using the same code paths as when an interrupt signal is received.
var shutdownRequestChannel = make(chan struct{})

// interruptSignals defines the default signals to catch in order to do a proper
// shutdown.  This may be modified during init depending on the platform.
var interruptSignals = []os.Signal{syscall.SIGINT, syscall.SIGTERM, syscall.SIGKILL, syscall.SIGQUIT}

// interruptListener listens for OS Signals such as SIGINT (Ctrl+C) and shutdown
// requests from shutdownRequestChannel.  It returns a channel that is closed
// when either signal is received.
func interruptListener() <-chan struct{} {
	c := make(chan struct{})
	go func() {
		interruptChannel := make(chan os.Signal, 1)
		signal.Notify(interruptChannel, interruptSignals...)

		// Listen for initial shutdown signal and close the returned
		// channel to notify the caller.
		select {
		case sig := <-interruptChannel:
			Logger.log.Warnf("Received signal (%s).  Shutting down...", sig)

		case <-shutdownRequestChannel:
			Logger.log.Warn("Shutdown requested.  Shutting down...")
		}
		close(c)

		// Listen for repeated signals and display a message so the user
		// knows the shutdown is in progress and the process is not
		// hung.
		for {
			select {
			case sig := <-interruptChannel:
				Logger.log.Infof("Received signal (%s).  Already shutting down...", sig)

			case <-shutdownRequestChannel:
				Logger.log.Info("Shutdown requested.  Already shutting down...")
			}
		}
	}()

	return c
}

// interruptRequested returns true when the channel returned by
// interruptListener was closed.  This simplifies early shutdown slightly since
// the caller can just use an if statement instead of a select.
func interruptRequested(interrupted <-chan struct{}) bool {
	select {
	case <-interrupted:
		return true
	default:
	}

	return false
}
