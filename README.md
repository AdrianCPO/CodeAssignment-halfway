I min frontend installerade jag:
Vite med "npm create vite@latest"
projektets mapp döpte jag till "Forum" sedan navigerade jag till projectmappen genom att skriva:
"cd Forum" i terminalen. I mappen skrev jag sedan i terminalen:
"npm install". 
Slutligen installerade jag react router DOM genom att skriva:
"npm install react-router-dom" i terminalen. Detta var mitt val för att hantera routingen i min React applikation.
Startkommando för frontend är "npm run dev". (Dock behöver man installera "npm install" på nytt pga min .gitignore node_modules)

I min projektmapp skaåade jag en ny mapp "Backend".
Jag navigerade till Backend med terminalkommando:
"cd Backend".
I backend gav jag terminalkommando:
"npm install express cors better-sqlite3"
Startkommando för backend är "nodemon index.js"

Min strukturering i koden.

    ── Backend/
│   ├── config/
│   │   └── database.js          # Konfiguration för databasen
│   ├── controllers/
│   │   ├── categoryController.js  # Logik för kategori-relaterade API-routes
│   │   ├── commentController.js   # Logik för kommentar-relaterade API-routes
│   │   └── threadController.js    # Logik för tråd-relaterade API-routes
│   ├── models/
│   │   ├── categoryModel.js       # Datamodell för kategorier
│   │   ├── commentModel.js        # Datamodell för kommentarer
│   │   └── threadModel.js         # Datamodell för trådar
│   ├── routes/
│   │   ├── categoryRoutes.js      # API-routes för kategorier
│   │   ├── commentRoutes.js       # API-routes för kommentarer
│   │   └── threadRoutes.js        # API-routes för trådar
│   ├── utils/
│   │   └── handleServerError.js  # Funktion för att hantera serverfel
│   └── index.js                  # Startfil för Backend-applikationen

Mappstruktur för frontend:

── Forum/
│   ├── src/
│   │   ├── CommentContextProvider.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── router.jsx
│   │   ├── ThreadContextProvider.jsx
│   │   └── index.html
│   ├── api/
│   │   ├── apiRequest.jsx
│   │   ├── apiService.jsx
│   │   ├── apiServiceCategories.jsx
│   │   └── apiServiceComments.jsx
│   ├── components/
│   │   ├── App.jsx
│   │   ├── CategoryFilter.jsx
│   │   ├── CategorySelect.jsx
│   │   ├── CommentForm.jsx
│   │   ├── CommentInput.jsx
│   │   ├── ErrorMessage.jsx
│   │   ├── Navbar.jsx
│   │   ├── SearchBar.jsx
│   │   ├── SortThreads.jsx
│   │   ├── ThreadForm.jsx
│   │   ├── ThreadInput.jsx
│   │   └── ThreadList.jsx
│   ├── styling/
│   │   ├── App.css
│   │   ├── buttons.css
│   │   ├── forms.css
│   │   ├── layout.css
│   │   ├── navbar.css
│   │   ├── responsive.css
│   │   ├── threads.css
│   │   └── variables.css
│   └── views/
│       ├── AddCommentView.jsx
│       ├── AddThreadView.jsx
│       ├── DeleteCommentView.jsx
│       ├── DeleteThreadView.jsx
│       ├── EditCommentViewContainer.jsx
│       ├── EditThreadViewContainer.jsx
│       ├── ThreadDetailView.jsx
│       └── ThreadViewContainer.jsx

Kort beskrivning av projektet:
Jag har tagit mig an att göra ett forum där användare kan skapa trådar och svara på andras trådar.
I applikationen kan man söka på trådar, sortera trådar och filtrera trådar. Man kan skapa trådar och ändra trådar. Man kan skriva kommentarer och ändra kommentarer. Man kan även ta bort trådar och kommentarer. Jag har även lagt in så man kan låsa trådar, på det sättet kan man inte skriva nya kommentarer till den tråden. Detta om trådskaparen fått svaren han behöver eller om han på något annat sätt vill hejda kommentarer. Jag har lagt in enklare felmeddelande om användaren inte fyllt i fälten korrekt vid skapande eller ändrande av tråd eller kommentar.

För att forumet ska vara användbart borde man dock lägga till en ny tabell i databasen (users) och sedan skapa någon form av autentisering. I nuläget kan vem som helst ändra eller ta bort innehåll på forumet.



Övrig information:

