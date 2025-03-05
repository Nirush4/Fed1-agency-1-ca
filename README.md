# FED1 JavaScript-1 Ca (Rainydays)

# Goal

Create an engaging, user-centric social media platform that fosters meaningful connections, promotes content discovery, and empowers users to share their ideas and experiences in a safe, secure, and interactive online community. This platform will provide users with a seamless experience to create personalized profiles, share diverse content, engage with others through likes, comments, and direct messaging, and discover new trends and connections, all while maintaining privacy and security. The ultimate goal is to create a thriving online ecosystem where users can express themselves, collaborate, and connect with others globally.

## User Stories

- ✅ As a user, I'm able to create, customize, and manage my profile, ensuring a personalized experience.
- ✅ As a user, I want to share my photos as a post within the platform..
- ✅ As a user, I want to see the feed to discover contents that is relevant to my interests.
- ✅ As a user, I want to remove my post from my profile.
- ✅ As a user, I want to search for posts, profiles, or hashtags to discover content and people of interest.
- ✅ As a user, I want to read my privacy policies and ensure that my data is secure.


## Resources

- [Brief](https://lms.noroff.no/pluginfile.php/339034/mod_resource/content/5/HTML__CSS_CA.pdf)
- [Design-desktop](https://www.figma.com/proto/hgQ4WNNGSHOxg9DViYzdIA/Rainydays-Superman?page-id=0%3A1&node-id=2-2&node-type=canvas&viewport=399%2C197%2C0.11&t=RfCGWTH6doE0euxU-1&scaling=scale-down&content-scaling=fixed)
- [Production deploy](https://rainydays-webshop-no.netlify.app/)
- [Deployment CI](https://app.netlify.com/sites/rainydays-webshop-no/overview)

## Report

- [Report](https://docs.google.com/document/d/1H2JoxjCNF8Yf_rbPC38OS2S-pcx8jDSjGrKi3KTpO6E/edit?usp=sharing)

## Features

- SEO friendly
- Responsive
- Prebuilt components
- E2E testing with every pull request

### Production

Production is the enviromewnt the end-user experience. This is the final product that will be deployed to the public. This enviroment is hosted on Netlify.

### Staging

Staging is the enviroment where the team can test the latest features and bug fixes. This enviroment is hosted on Vercel.

## Built with

<img src="/images/html-logo.png" width="60" height="60"> <img src="/images/css-logo.webp" width="60" height="60"> <img src="/images/js-logo.png" width="60" height="60">

## Testing and debug:

- https://validator.w3.org/
- https://wave.webaim.org/


# Required Software

Node.js: Ensure Node.js is installed on your system. It's required for running the development server and managing project dependencies. Download it from nodejs.org.
Git: Version control system for tracking changes and collaborating. Download from git-scm.com.
Visual Studio Code (VS Code): Recommended code editor for its extensive support for JavaScript development. Download from code.visualstudio.com.

## Dependencies in use:

- [Tailwind Css](https://tailwindcss.com)
- [Prettier](https://prettier.io/) - An opinionated code formatter
- [Eslint](https://eslint.org/) - Find and fix problems in your JavaScript code


## Installation

Clone the repo:
```
gh repo clone NoroffFEU/agency.noroff.dev
```
Install dependencies:
```
npm i
```
## Running the Project

Do not use live-server or any other server, as this will not work. The project is configured to run with Vite. Run the project with the following command.
```
npm run dev
```
This will start a local server on port 5173. You can access the page by going to http://127.0.0.1:5173/.

To build the project, run the following command:
```
npm run build
```
This will create a dist folder in the root of the project, which contains the compiled project.

You can preview the build by running the following command:
```
npm run build-preview
```
This is useful to see how the project will look when deployed and to test the build. This is recommended before pushing to the repository, as the build will be tested when creating a PR.

#Contributing

## Step 1: Update the Main Branch

Start by making sure you are working with the most current version of the project:

- Switch to Main Branch: First, switch to the main branch (if you're not there already). This ensures you're updating the right branch.
  ```
  git checkout main
  ```
- Pull Latest Changes: Then, pull the latest changes from the main repository. This step updates your local main branch.
  ```
  git pull
  ```
  ## Step 2: Create Your Feature or Fix Branch
  After updating the main branch, create a new branch for your work. Name your branch descriptively, such as feature/new-listing-page for a new feature or fix/login-issue for a bug fix.
  ```
  git checkout -b feature/new-listing-page
  ```
 ## Step 3: Make Your Changes
 Now, it's time to make your changes. Remember to:
 
 - Write clean, well-documented code.
 - Follow the coding standards of the project.
 - Test your changes thoroughly.

 ## Step 4: Commit and Push Your Changes

 Once you start making changes, it's good practice to commit often and keep commits small. This approach helps in maintaining a clear history of changes, making it easier to track and understand each modification. Small, frequent commits are also easier to manage in terms of resolving potential conflicts and reviewing changes.

 - Commit Often: After making a meaningful amount of changes or completing a specific task, commit your changes. This could be after fixing a bug, adding a small feature, or even updating documentation.
 - Write Clear Commit Messages: Each commit message should be clear and descriptive of what the changes entail. This practice is crucial for collaborative work.
