package main

import (
	"fmt"

	ec "github.com/ethereum/go-ethereum/common"
)

// Define the committees struct
type committees struct {
	beacons     []ec.Address
	bridges     []ec.Address
	beaconPrivs [][]byte
	bridgePrivs [][]byte
}

// getCommitteeHardcoded is for deploying scripts
func getCommitteeHardcoded() *committees {
	beaconComm := []string{
		"0xD7d93b7fa42b60b6076f3017fCA99b69257A912D",
		"0xf25ee30cfed2d2768C51A6Eb6787890C1c364cA4",
		"0x0D8c517557f3edE116988DD7EC0bAF83b96fe0Cb",
		"0xc225fcd5CE8Ad42863182Ab71acb6abD9C4ddCbE",
	}
	bridgeComm := []string{
		"0x28655822DAf6c4B32303B06e875F92dC6e242cE4",
		"0xD2902ab2F5dF2b17C5A5aa380f511F04a2542E10",
		"0xB67376ad63EAdC22f05efE428e93f09D4f13B4fD",
		"0x40bAA64EAFbD355f5427d127979f377cfA48cc10",
	}
	beacons, bridges := toAddresses(beaconComm, bridgeComm)
	return &committees{
		beacons: beacons,
		bridges: bridges,
	}
}

// Helper function to convert string hex addresses to ec.Address
func toAddresses(beaconComm, bridgeComm []string) ([]ec.Address, []ec.Address) {
	beacons := make([]ec.Address, len(beaconComm))
	for i, p := range beaconComm {
		beacons[i] = ec.HexToAddress(p)
	}

	bridges := make([]ec.Address, len(bridgeComm))
	for i, p := range bridgeComm {
		bridges[i] = ec.HexToAddress(p)
	}
	return beacons, bridges
}

// Entry point for the application
func main() {
	committee := getCommitteeHardcoded()

	// Print the resulting committees for debugging purposes
	fmt.Println("Beacons:")
	for _, b := range committee.beacons {
		fmt.Println(b.Hex())
	}

	fmt.Println("\nBridges:")
	for _, br := range committee.bridges {
		fmt.Println(br.Hex())
	}
}
