#!/usr/bin/env bash
## start highway
tmux send-keys -t highway1 C-C ENTER ./run.sh\ lc1 ENTER
sleep 1
tmux send-keys -t highway2 C-C ENTER ./run.sh\ lc2 ENTER
sleep 1
