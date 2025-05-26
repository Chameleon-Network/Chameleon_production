#!/bin/bash

echo "Cleaning up generated files..."

# Remove node_modules
if [ -d "node_modules" ]; then
  echo "Removing node_modules directory..."
  rm -rf node_modules
fi

# Remove Hardhat artifacts and cache
if [ -d "artifacts" ]; then
  echo "Removing Hardhat artifacts..."
  rm -rf artifacts
fi

if [ -d "cache" ]; then
  echo "Removing Hardhat cache..."
  rm -rf cache
fi

# Remove typechain-types if exists
if [ -d "typechain-types" ]; then
  echo "Removing typechain-types..."
  rm -rf typechain-types
fi

echo "Cleanup completed!"
