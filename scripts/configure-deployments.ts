// eslint-disable-next-line node/no-unpublished-import
import { execSync } from 'child_process';
import { readFileSync } from 'fs';

import Prompts from 'prompts';

const getVercelProjectId = async () => {
  // Check if can read the vercel project ID from local config
  try {
    const localConfig = readFileSync('./.vercel/project.json', 'utf8');
    const { projectId } = JSON.parse(localConfig);
    return projectId;
  } catch {
    // Ignore
  }

  // Ask the user to setup or select the project
  execSync('vercel link', { stdio: 'inherit' });
  return getVercelProjectId(); // Should have setup the local config
};

// Ask for the environment
(async () => {
  const vercelProjectId = await getVercelProjectId();

  const { environment } = await Prompts([
    {
      type: 'multiselect',
      name: 'environment',
      message: 'Which environment do you want to configure?',
      choices: [
        { title: 'Staging', value: 'staging' },
        { title: 'Production', value: 'production' },
      ],
    },
  ]);

  console.log(
    `Head to ${
      environment === 'staging' ? 'https://staging.opencollective.com' : 'https://opencollective.com'
    } and go to the profile where the OAuth application will be created, `,
  );

  const { oAuthClientId, oAuthClientSecret } = await Prompts(
    {
      type: 'text',
      name: 'oAuthClientId',
      message: 'What is the OAuth Client ID?',
    },
    {
      type: 'text',
      name: 'oAuthClientSecret',
      message: 'What is the OAuth Client Secret?',
    },
  );
})();
