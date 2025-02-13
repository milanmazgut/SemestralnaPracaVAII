# Semestrálna práca VAII (vetva „react“)

Tento projekt kombinuje **.NET** (C#), **React (TypeScript)** a **Microsoft SQL Server**.

---

## 1. Čo potrebujeme mať nainštalované

1. **.NET SDK**  
   - Overíme si príkazom:
     ```
     dotnet --version
     ```
   - Ak ešte .NET nemáme, stiahneme ho z oficiálnej stránky [.NET Downloads](https://dotnet.microsoft.com/en-us/download).

2. **Microsoft SQL Server**  
   - Pre jednoduchšiu správu databázy môžeme použiť **SQL Server Management Studio (SSMS)**.

3. **Node.js**  
   - Overíme si príkazom:
     ```
     node -v
     ```
   - Ak ešte Node.js nemáme, stiahneme ho z [oficiálnej Node.js stránky](https://nodejs.org/).

4. **Git**  

---

## 2. Inštalácia projektu

### 2.1 Klonovanie repozitára a prepnutie na vetvu `react`

1. V ľubovoľnom priečinku si otvoríme terminál/PowerShell.  
2. Naklonujeme repozitár:
   ```
   git clone https://github.com/milanmazgut/SemestralnaPracaVAII.git
   ```
3. Prejdeme do zložky projektu:
   ```
   cd SemestralnaPracaVAII
   ```
4. Prepneme sa na vetvu react:
   ```
   git checkout react
   ```
### 2.2 Spustenie .Net servera
  1. Prejdeme do zalozky semestralnaPraca.Server
  2. Skompilujeme a spustime server
   ```
   dotnet build
   dotnet run
   ```
### 2.3 Spustenie react clienta
1. Prejdeme do priecinka semestralnaPraca.klient
   ```
   cd semestralnaPraca.klient
   ```
2. Nainštalujeme balíčky príkazom
   ```
   npm install
   ```
4. Spustíme príkazom
   ```
   npm run
   ```




   
