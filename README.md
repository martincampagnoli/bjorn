# Opdracht blok 1 HBO-ICT SE

![HBO-ICT](/wwwroot/public/dokkie.png)

## Hoe is deze repository ingericht

- Story-board. Via het menu links (Plan > Issues) vind je alle user stories.
- Broncode in de map `src` (Repository). Dit is een kale webapplicatie. Deze moet jij aanpassen.
- Documentatie in de map `docs` (Repository). In de docs vindt je alle informatie en hou je jouw portfolio bij dit project.

## Project setup

1. Installeer Visual Studio Code, deze kun je downloaden via https://code.visualstudio.com/.

2. Installeer de volgende plugins voor Visual Studio Code. Dit kan via de browser, of vanuit Visual Studio Code zelf in de `Extensions` sectie van de linker menubalk:
    - ESLint: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
    - EditorConfig: https://marketplace.visualstudio.com/items?itemName=editorconfig.editorconfig

3. Installeer NodeJS, deze kun je voor jouw systeem downloaden via https://nodejs.org/en/download/prebuilt-installer. 
   - **Let op!** Installeer versie `20.x.x`!

4. Installeer Git, voor uitleg zie de [knowledgebase](https://knowledgebase.hbo-ict-hva.nl/1_beroepstaken/software/manage_and_control/git/installeren/git_installeren/#git-installeren).

5. Configureer Git, voor uitleg zie de [knowledgebase](https://knowledgebase.hbo-ict-hva.nl/1_beroepstaken/software/manage_and_control/git/installeren/git_installeren/#git-configureren).

6. Maak een SSH key aan en koppel deze aan GitLab, voor uitleg zie de [knowledgebase](https://knowledgebase.hbo-ict-hva.nl/1_beroepstaken/software/manage_and_control/git/installeren/git_installeren/#git-koppelen-aan-gitlab).

7. Clone dit project met Git naar je computer, dit kan je via de terminal doen met een `git clone` commando, vanuit Visual Studio Code zelf of met een visueel programma als Fork (https://git-fork.com/).

8. Open na het clonen de map in Visual Studio Code met `File > Open Folder...`.

9. Ga in de menubalk naar `View > Open View...` en zoek naar "NPM". Als je nu in de `Explorer` sectie van de linker menubalk op de `package.json` klikt, krijg je een extra paneel erbij met de naam "NPM Scripts". 

10. In het "NPM Scripts"-paneel, klik met rechts op `package.json` en klik op `Run Install`, of voer handmatig `npm install` in een terminal uit.

11. Klik nu op de pijl achter `dev`, of voer handmatig `npm run dev` in een termimal uit.
    - Via de build tool [Vite](https://vitejs.dev/) wordt er een lokale server opgestart. Als je de URL uit de terminal (als het goed is: http://127.0.0.1:3000) in de browser opent, zie je de webapplicatie. Wijzigingen die je maakt in de code worden nu realtime (direct) herladen!

12. Bekijk de map `wwwroot` en ga op zoek naar de index.html bestand.

## Studiehandleiding

In de Studiehandleiding op de DLO staat beschreven welke competenties je gaat ontwikkelen en wat de leeruitkomsten zijn voor dit blok.

## Opdrachtomschrijving

De volledige opdrachtomschrijving van dit project vind je in de [Knowledgebase](https://student-knowledgebase-pijlb-8498930bd08f0a73be9134e5e9c23c014d4.dev.hihva.nl/) onder _Leerroutes > Software Engineering > Opdracht 1_
