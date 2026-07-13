import os from 'os';
import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import transformCookies from './transformCookies.ts';

const grabCookiesFromLocalStorage = async () => {
  console.log('Grabbing cookies from local storage...');

  // Return early if the user has provided a cookies.json file (backward compatibility with v1.0.0)
  const cookiesJsonPath = path.join('./', 'cookies.json');
  if (fs.existsSync(cookiesJsonPath)) {
    const cookiesData = JSON.parse(fs.readFileSync(cookiesJsonPath, 'utf-8'));
    console.log('Found cookies.json, using that for cookies.');
    return transformCookies(cookiesData);
  }

  // Grab cookies from Firefox profile
  const firefoxPath = path.join(os.homedir(), '.mozilla', 'firefox');
  const profileDir = fs
    .readdirSync(firefoxPath)
    .filter((name) => name.endsWith('.default-release'))[0];
  if (!profileDir) {
    throw new Error(`No Firefox default-release profile found in ${firefoxPath}`);
  }
  const cookiesPath = path.join(firefoxPath, profileDir, 'cookies.sqlite');
  console.log(`Located cookies.sqlite at: ${cookiesPath}`);

  // Read cookies from the SQLite database
  const db = new Database(cookiesPath, { readonly: true });
  const stmt = db.prepare("SELECT * FROM moz_cookies WHERE host LIKE '%youtube.com%'");
  const rawCookies = stmt.all();
  const transformedCookies = transformCookies(rawCookies);

  db.close();
  console.log('Converted cookies to Playwright format.');

  return transformedCookies;
};

export default grabCookiesFromLocalStorage;
