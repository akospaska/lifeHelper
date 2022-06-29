# LifeHelper Mobile Application with Backend MicroServices

## Roadmap

- [x] Create The authentication layer
- [x] Create the Grocery Service
- [x] Create automatized docker images creation
- [x] Create Github actions automatized test flow
- [x] Create Weight tracker Frontend - Alpha version has been released
- [x] Create BabySleep tracker Frontend - Alpha version has been released
- [x] Create BabySleep tracker Backend - Alpha version has been released
- [ ] Create Weight tracker Backend
- [ ] Create HomeFinance Frontend
- [ ] Create HomeFinance Backend

### Used Technologies:

<p float="left">
<img src="./.github/ReadMe_src/images/nodejs.svg" width="50">
<img src="./.github/ReadMe_src/images/typescript.svg" width="50">
<img src="./.github/ReadMe_src/images/hapi.svg" width="50">
<img src="./.github/ReadMe_src/images/docker.svg" width="50">
<img src="./.github/ReadMe_src/images/mysql.svg" width="50">
<img src="./.github/ReadMe_src/images/redis.svg" width="50">
<img src="./.github/ReadMe_src/images/react.svg" width="50">
<img src="./.github/ReadMe_src/images/redux.svg" width="50">
<img src="./.github/ReadMe_src/images/rabbitmq.svg" width="100" height="20">
</p>

# Backend

## Architecture

<p align="left"><img src="./.github/ReadMe_src/images/architecture.jpg" width="550" style="border-radius:5%"></p>

The backend code has been written in NodeJS + TypeScript.

The used NodeJS framework is Hapi.

## There are three different microservices.

### ApiGateway

- The only exposed service
- Fordwards the requests between the services and the client side

### Auth web process

- Validate the Login credentials
- Validate the session Cookie and returns the account informations
- Database:
  - MySql
  - Redis
  - Store sessions

### Auth worker process

- Handles the email sendings by the forget password requests
- Handles the email sendings by the registration requests

### Grocery Service

- Serve the grocery list by the groupId
- Create new categories
- Delete categories
- Create new items
- Delete items
- Create User groups
- Delete user groups
- Database:
  - MySql

## Docker <img src="./.github/ReadMe_src/images/docker.svg" width="20">

- The production environment uses docker images
- Theese images are size reduced, because of the images has been built by the transpiled javascript code.
- The images are created automaticly when the code merge has been done to the Master branch.

- The docker images are tagged with the latest commit hash.

## Github <img src="./.github/ReadMe_src/images/github.svg" width="20">

<p align="left"><img src="./.github/ReadMe_src/images/githubactions.png" width="500" style="border-radius:5%"></p>

- If a new Pull Request has been opened to the develop branch, it triggers the test runner.

- If the master branch gets a new code merge, then the new docker images has been building and tagging them by the latest commit hash.

# Frontend: <img src="./.github/ReadMe_src/images/react.svg" width="20">

## Features:

- Login:

  - The user can Login into the app. ("Such a feature")
  - Can create a new account.
  - Can send a forgot password request

<p align="left"><img src="./.github/ReadMe_src/images/Login.jpg" width="500" style="border-radius:10%"></p>

Menu:

<p align="left"><img src="./.github/ReadMe_src/images/MainMenu.jpg" width="300" style="border-radius:10%"></p>

The following features are done.

- Grocery List:
  - The user can create user groups and share the items between the groups
  - Can create and delete items
  - Can create and delete categories
  - Can modify categories

## <p align="left"><img src="./.github/ReadMe_src/images/Grocery.jpg" width="550" style="border-radius:5%"></p>

---

- Baby Sleep Tracker:
  - Main purpose of this application is record the activities of the babies and get propper statistics based on the records
  - The user can register, remove or modify a child/children
  - Start recording the choosen activity automatically.
  - Stop recording the choosen activity automatically.
  - Record the activity manually.
  - Get different statistics based on the activity or the time intervall.
  - Get charts statistics based on the activity or the time intervall.

## <p align="left"><img src="./.github/ReadMe_src/images/babyTracker.jpg" width="550" style="border-radius:5%"></p>

---
