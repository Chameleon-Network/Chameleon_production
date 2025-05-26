**Prerequisites:**

- Ubuntu 18.04 or higher
- git
- golang 1.12.9
- tmux
- curl

**Minimum hardware requirement:**

- 8 CPU ~ 2.4Ghz
- 12 GB of RAM

**recommended hardware requirement:**

- 16 CPU ~ 2.4Ghz
- 24 GB of RAM

## #SECTION I: DEPLOY THE INCOGNITO-HIGHWAY

## Installation
Install to the `$GOPATH` folder.
```shell
$ go install
```

## Run Incognito chain
1. Build the highway binary
```
go build -o highway
```

2. Create tmux sessions:
```
bash create_tmux.sh
```

3. Start the highway
```
bash start_highway.sh
```

4. Verify that the chain is running: go to each tmux session, you would see the running log on screen.
    eg:

```
tmux a -t highway1
```
