# FigmaDashboard
ITWS Capstone Group 3 Term Project: Microsoft Figma Dashboard


Use: The Figma Dashboard is a tool meant to increase the functionality of Figma.
It pulls from the Figma API to populate the dashboard with the projects and features
that are already on Figma. Furthermore, new versions of designs are able to be created
for any given feature. These new versions will be stored and have comments and statuses
associated with them.

Usage Steps:
1. Navigate to the dashboard. If served locally, it will be under localhost:4200
2. Press the login button which will redirect you to OAuthentication with Figma
3. Login using your Figma credentials
4. To add a team id, navigate to a team and Figma. The team id will be stored 
in the URL of this page.
Extra info can be found here: https://spectrum.chat/figma/general/how-to-get-team-id-and-project-id-for-api~191126f9-ec4f-4c4f-9964-766ae2b4916f
5. Select the team id in the leftmost dropdown menu. This will populate the dashboard
with all of the projects associated with that team.
6. Click on the "View Features" button for the desired project. This will bring you
to a page with all of the features for the selected project.
7. Click on the "View Versions" button for the desired feature. This will bring you
to a page with all of the versions of the selected feature.
8. To add a new version, click on the "Add New Version" button and fill out all the 
required fields. Adding this version will cause it to appear at the top of all versions.
9. To filter versions by a given status, check the "filter by status" box and select
the desired status to view. This will display all versions that have the selected status.
10. To add a comment, enter a comment in the pane for the desired version. Click on the
"Add Comment" button to add the comment to the bottom of the comment list.


Installation:

Node: 
1. Navigate to the server folder in the terminal.
2. Run "npm install" to install all required node modules and dependencies.

Angular:
1. Follow angular instructions to install angular cli
Detailed instructions can be found at https://angular.io/
2. Navigate the the FigmaDashboardMicrosoft folder and run npm install.

MongoDB:
1. Create a mongodb instance to store information. This can be hosted anywhere,
including local machine.
More information can be found here: https://docs.mongodb.com/manual/installation/
2. Add the URL for the mongo instance into the .env file in the MONGO_URL variable

Run:
After installation, the application is ready to be run.
Make sure the .env file is up to date with the necessary information.
1. Navigate to the FigmaDashboardMicrosoft folder in the terminal. Run
"ng serve" (may need "sudo ng serve" for linux terminals) to start the angular server.
Once the terminal reaches 100% for compiling, move to step 2.
2. Navigate to the server file in a separate terminal. 
Run "node server.js" to start the server. Once the terminal outputs that the 
server is listening on port 8080, it is ready to be used.
3. At this point, navigate to the web application in a browser 
(defaults to localhost:4200) and enjoy!


