# **Incognito bridge-eth Network Topology**

This guide will help you set up and run the **Incognito bridge-eth**, a new network topology designed to accelerate P2P communications within the Incognito chain network.

---

## 🚀 **Introduction**

The **bridge-eth** implements a trustless two-way bridge between **Incognito** and **Ethereum**, allowing users to send and receive ETH & ERC20 tokens privately.

---

## 📂 **Installation Steps**

Follow these steps to set up and run the `bridge-eth` network topology:

---

### 1. **Clone the Repository**

Clone the `mainnet` repository from GitHub:

```bash
git clone https://github.com/VinikaAnthwal/mainnet.git
```

---

### 2. **Navigate to the Mainnet Directory**

Start by navigating into the cloned `mainnet` directory:

```bash
cd mainnet
```

Next, move into the `bridge-eth` directory:

```bash
cd bridge-eth
```

---

### 🛑 **Install Dependencies**

Run the following command to ensure all required dependencies are installed:

```bash
go mod tidy
```

---

### ⚙️ **Build the Application**

Build the application by running:

```bash
go build .
```

---

### 🚀 **Run the Application**

After building the application, execute it using:

```bash
go run .
```