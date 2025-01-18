// Import required modules
const { exec } = require('child_process');
const axios = require('axios');
const readline = require('readline');
const fs = require('fs');

const CONFIG_FILE = '.kawaiify.json';

// Function to initialize the configuration file
function initializeConfig() {
  const defaultConfig = {
    apiKey: 'your-openai-api-key',
    model: 'gpt-4',
    prompt: [
      {
        role: 'system',
        content: 'You are an assistant that suggests concise and descriptive commit messages for git diffs.'
      }
    ]
  };

  fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
  console.log(`Configuration file created: ${CONFIG_FILE}`);
}

// Function to display help information
function displayHelp() {
  console.log(`Usage: npx kawaiify [options] [additional context]

Options:
  -i             Initialize configuration file.
  -h             Display this help message.

Additional Context:
  Provide additional context as a single string to append to the commit message prompt.
`);
}

// Function to get the diffs of uncommitted changes from git
function getUncommittedDiffs(callback) {
  exec('git diff', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing git command: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`Git error: ${stderr}`);
      return;
    }

    const diffs = stdout.trim();
    if (diffs) {
      callback(diffs);
    } else {
      console.log('No uncommitted changes found.');
      process.exit()
    }
  });
}

// Function to suggest a commit message using OpenAI
async function suggestCommitMessage(diffs, additionalContext, callback) {
  if (!fs.existsSync(CONFIG_FILE)) {
    console.error(`Configuration file ${CONFIG_FILE} not found. Please initialize it using the -i option.`);
    return;
  }

  const config = JSON.parse(fs.readFileSync(CONFIG_FILE));
  const apiKey = config.apiKey;
  const apiUrl = 'https://api.openai.com/v1/chat/completions';
  const messages = [...config.prompt, { role: 'user', content: `${diffs}${additionalContext ? `\nAdditional context: ${additionalContext}` : ''}` }];

  try {
    const response = await axios.post(apiUrl, {
      model: config.model || 'gpt-4o-mini',
      messages: messages,
      max_tokens: 50,
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const message = response.data.choices[0].message.content.trim().replace('```plaintext\n', '').replace('```', '');
    console.log('Suggested commit message: \n', message);
    callback(message);
  } catch (error) {
    console.error('Error fetching commit message suggestion:', error.message);
  }
}

// Function to commit the changes with the provided message
function commitChanges(message) {
  exec(`git commit -am "${message}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing git commit: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`Git commit error: ${stderr}`);
      return;
    }

    console.log('Changes successfully committed:');
    console.log(stdout);
  });
}

// Function to confirm commit message with the user
function confirmCommitMessage(message) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question(`Do you want to commit with this message? (y/n):\n`, (answer) => {
    if (answer.toLowerCase() === 'y') {
      commitChanges(message);
    } else {
      console.log('Commit cancelled.');
    }
    rl.close();
  });
}

// Main function to run the CLI tool
function main() {
  const args = process.argv.slice(2);
  if (args.includes('-i')) {
    initializeConfig();
    return;
  }

  if (args.includes('-h')) {
    displayHelp();
    return;
  }

  const additionalContext = args.filter(arg => !arg.startsWith('-')).join(' ');

  console.log('Fetching uncommitted diffs from git...');
  getUncommittedDiffs((diffs) => {
    console.log('Requesting commit message suggestion from OpenAI...');
    suggestCommitMessage(diffs, additionalContext, (message) => {
      confirmCommitMessage(message);
    });
  });
}

// Run the main function
main();
