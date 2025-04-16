const sectionQueries = [
  {
    section: 'OVERVIEW',
    queryString:
      '(text contains a comprehensive description of what the project is about, including its main goals, high-level functionality, and vision, often found in README or introductory sections)',
    prompt:
      'Analyze the provided chunks to extract a detailed and comprehensive overview of the project. Describe the primary purpose, major functionalities, key objectives, and overall vision of the project, ensuring that the explanation is accessible to both technical and non-technical users.',
  },
  {
    section: 'INSTALLATION',
    queryString:
      '(instructions that explain how to install the software, including setting up dependencies, preparing the environment, and running initial setup commands)',
    prompt:
      'Extract and elaborate on the installation instructions by gathering information from relevant files and documentation. Detail all prerequisites, dependency steps, environment setups, and specific commands (e.g., from package.json, requirements.txt, or setup scripts) to ensure users can install the project smoothly.',
  },
  {
    section: 'USAGE',
    queryString:
      '(step-by-step guidance or instructions on how to execute or use the project, including command line examples and expected outputs)',
    prompt:
      'Review the repository content to collate usage instructions and examples. Provide a clear, step-by-step guide on how to run the project, including practical command line examples, configuration options, and explanations of expected output to assist users in effectively using the software.',
  },
  {
    section: 'TECH-STACK',
    queryString:
      '(a list or description of the technologies, programming languages, frameworks, libraries, or tools used to develop and run the project)',
    prompt:
      "Gather and synthesize information about the technologies used throughout the project. Describe the programming languages, frameworks, libraries, build tools, and any ancillary software (e.g., Docker or CI/CD pipelines) that are used to build and run the project, ensuring a complete picture of the project's technical architecture.",
  },
  {
    section: 'FEATURES',
    queryString:
      '(detailed listing of what the project can do, including its main functionalities, modules, and capabilities, usually in the form of a feature list)',
    prompt:
      'From the repository documentation and source files, extract a list of key features and functionalities. Provide detailed descriptions of each feature, including its purpose, benefits, and potential use cases. Ensure that both core capabilities and advanced functionalities are clearly highlighted.',
  },
  {
    section: 'CONTRIBUTING',
    queryString:
      '(step-by-step guide on how others can contribute to the project, including development guidelines, submission process, and collaboration practices)',
    prompt:
      "Compile and refine the contribution guidelines from the project's documentation. Describe the process for contributing, including code style guidelines, branch management, testing requirements, and instructions for submitting pull requests. Emphasize how contributors can get started and collaborate effectively on the project.",
  },
  {
    section: 'LICENSE',
    queryString:
      '(detailed explanation or reference to the type of software license the project uses, including any usage restrictions and permissions)',
    prompt:
      "Review the repository for licensing information to generate a clear explanation of the project's license. Provide detailed context on the type of license used, permissions granted, restrictions imposed, and any conditions that users or contributors should be aware of, ensuring the license's implications are clearly communicated.",
  },
  {
    section: 'ENVIRONMENT VARIABLES',
    queryString:
      '(list and explanation of the environment-specific variables that need to be defined for proper functioning of the project, usually found in .env files)',
    prompt:
      'Identify and describe the environment variables essential to the project’s operation. Provide specific details including variable names, expected values, and their impact on functionality. Incorporate any notes from .env files, documentation, or setup scripts to explain how these variables can be configured for different environments.',
  },
  {
    section: 'CONFIGURATION',
    queryString:
      '(instructions or files related to customizing or setting up the application’s behavior, such as config files and documentation references)',
    prompt:
      'Extract information from configuration files and documentation to construct a detailed guide on project configuration. Explain the role of each configuration parameter, how it affects system behavior, and the steps required to adjust settings for various environments (development, staging, production).',
  },
  {
    section: 'FOLDER STRUCTURE',
    queryString:
      '(description of how the project’s files and folders are organized, often represented in a tree format or layout overview)',
    prompt:
      'Analyze the project’s file organization to generate a comprehensive overview of its folder structure. Detail the main directories and key files, explain the purpose of each segment, and illustrate how the overall structure supports the project’s modularity and maintainability.',
  },
  {
    section: 'DEPENDENCIES',
    queryString:
      '(detailed listing of external libraries, packages, or modules the project relies on, often listed in dependency files like package.json or requirements.txt)',
    prompt:
      'Review dependency declarations within common files like package.json, requirements.txt, or composer.json. Provide a detailed list of external libraries and tools used in the project along with explanations of their roles, version constraints, and any specific configuration or setup details necessary for the dependencies.',
  },
  {
    section: 'DATABASE SCHEMA',
    queryString:
      '(any SQL schema, ER diagrams, or structured data models that explain how the project organizes and stores data)',
    prompt:
      'Extract and organize information detailing the project’s database schema. Describe the structure of database tables, relationships, and design principles. Include references to any migration scripts, ER diagrams, or SQL schema files to give users a clear understanding of how data is organized.',
  },
  {
    section: 'API DOCUMENTATION',
    queryString:
      '(complete documentation about the API including endpoint routes, input parameters, output formats, authentication, and usage examples)',
    prompt:
      'Gather detailed descriptions from files containing API documentation. Provide a comprehensive summary of available endpoints, including request parameters, response structures, authentication mechanisms, and usage examples. Ensure the generated documentation is sufficiently detailed to guide developers in integrating with the API.',
  },
  {
    section: 'DEPLOYMENT',
    queryString:
      '(step-by-step instructions or scripts that explain how to deploy the project to servers, containers, or cloud platforms including CI/CD configurations)',
    prompt:
      'Using information from deployment scripts and configuration files, describe the complete deployment process. Explain the steps required to set up, configure, and deploy the project on various platforms or containers. Include details on continuous integration/continuous deployment pipelines, if available, to assist users in replicating the deployment process.',
  },
  {
    section: 'SCREENSHOTS',
    queryString:
      '(visual assets or image-based examples that showcase the user interface or features of the project, including GIFs and annotated screenshots)',
    prompt:
      'Search for references to images and demo media within the project documentation. Assemble a detailed description that explains the context and purpose of each visual asset, including how they demonstrate the project’s user interface, functionality, or unique features.',
  },
  {
    section: 'ROADMAP',
    queryString:
      '(plans or outlines detailing the upcoming features, goals, or milestones that define the project’s future direction)',
    prompt:
      'Extract the project’s future plans and roadmap details from planning documents and TODO lists. Provide a thorough overview of upcoming features, strategic milestones, and long-term goals. Explain how these future developments will enhance the project and guide its evolution over time.',
  },
  {
    section: 'FAQ',
    queryString:
      '(sections answering common questions or solving frequently encountered issues by users, often presented as a list of questions and answers)',
    prompt:
      'Compile and detail a comprehensive FAQ section by gathering common queries and issues documented within the repository. For each frequently asked question, provide an in-depth answer or troubleshooting step designed to help users quickly resolve problems and better understand the project.',
  },
  {
    section: 'ACKNOWLEDGEMENTS',
    queryString:
      '(sections that thank individuals, contributors, or third-party resources for their help, support, or inspiration during project development)',
    prompt:
      'Identify and compile a list of individuals, libraries, and external resources that have significantly contributed to the project’s development. Provide detailed acknowledgements that not only credit contributions but also explain the nature of the support and its impact on the project.',
  },
  {
    section: 'SUPPORT',
    queryString:
      '(information on how users can get help, contact the maintainers, or participate in community discussions for troubleshooting and issue resolution)',
    prompt:
      'Extract support-related information from documentation and contact references. Describe the available channels for user support, including contact email addresses, community forums, or live chat options. Provide guidelines on how to seek help or report issues effectively within the project.',
  },
  {
    section: 'PROJECT STATUS',
    queryString:
      '(statements or badges indicating the current state of the project such as active development, deprecated, under maintenance, or release phase)',
    prompt:
      "Analyze the repository for indicators of the project's current status. Provide an in-depth status update that outlines whether the project is actively being developed, maintained, or has reached a stable/mature stage. Include any notes on current issues, release updates, or deprecation if applicable.",
  },
  {
    section: 'AUTHOR',
    queryString:
      '(biographical or contact details about the individual or organization who built or maintains the project, including links to their profiles)',
    prompt:
      'Compile detailed information about the project author or maintainer using references from profile and contact details. Present a clear biography, highlighting professional background, areas of expertise, and ways to connect via professional networks or social media channels.',
  },
];

export default sectionQueries;
