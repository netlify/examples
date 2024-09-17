#!/usr/bin/env bash

cd .stackbit/custom-controls
echo "installing custom-controls dependencies"
npm install
echo "building custom controls"
npm run build
echo "custom controls successfully built"