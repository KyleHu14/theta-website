# Introduction

This website serves as a tool for the Kappa Alpha Theta sorority at UCI. The website is built with NextJS, MantineUI, and TypeScript.

Directions to run :

1. cd into the theta-website directory
2. type npm run dev
3. navigate to localhost:3000/boothing
4. right click -> inspect -> console

# Usage

## Schedule Generator

### Introduction

As of now, when the user navigates to the boothing tab a schedule will be generated based on the CSV file uploaded by the user.

### Algorithm Rundown

In the utils folder the logic of the scheduling algorithm is in the algorithm.ts file. The algorithm is divided into the following stages :

1.
