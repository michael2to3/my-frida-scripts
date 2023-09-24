# My Frida Scripts
![GitHub last commit](https://img.shields.io/github/last-commit/michael2to3/my-frida-scripts)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/michael2to3/my-frida-scripts)
![GitHub stars](https://img.shields.io/github/stars/michael2to3/my-frida-scripts?style=social)

## Description
This repository contains various Frida scripts useful for dynamic analysis of Android applications. These scripts are designed to hook into Android methods and monitor specific behaviors in real-time.

## How To Use
1. Clone the repository:
   ```
   git clone https://github.com/michael2to3/my-frida-scripts.git
   ```
2. Navigate into the `src` folder:
   ```
   cd my-frida-scripts/src
   ```
3. Run the Frida server on your Android device.
4. Use the Frida CLI to run your desired script. For example:
   ```
   frida -U -l hook_with_arg.js -f com.example
   ```

## Scripts
| Name                | Description                                     |
|---------------------|-------------------------------------------------|
| `hook_with_arg.js`  | Hooks into specified classes and methods, logs arguments and return values containing the text "1478". |

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
