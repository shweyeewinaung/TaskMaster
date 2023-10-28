# Task Master By Shwe

## Description

Users can create, view, update, and delete tasks. While updating a task, the system prevents concurrent actions. Additionally, the total task count is displayed under the task list.

## Requirements

- Node.js (v19.6.1 - recommended version)
- NPM (9.4.0 - recommended version)

## Installation

1. Clone the repository to your local machine.

   ```bash
   git clone git@github.com:shweyeewinaung/TaskMaster.git
   ```

2. Navigate to the project folder.

   ```bash
   cd TaskMaster
   ```

3. Install the dependencies.

   ```bash
   using NPM
   npm install
   ```

4. Running the json-server
   Run the following command to start the development server on `http://localhost:3001`:

   ```bash
   json-server --watch db.json --port 3001
   ```

5. Running the Application
   Run the following command to start the development server on `http://localhost:3000`:

   ```bash
   npm run dev
   ```
