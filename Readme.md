# Supranova

Supranova is a decentralized protocol built on Lit Protocol that enables secure account and token management through Twitter authentication.

## Overview

The protocol consists of several key components:

- **Actions**: Lit Protocol actions for Twitter auth and account management
- **SDK**: TypeScript SDK for interacting with the protocol
- **Contracts**: Move smart contracts for on-chain functionality  
- **Twitter Bot**: Automated bot for user interactions

## Components

### [Actions](./actions)
Lit Protocol actions for secure computation:
- Twitter OAuth authentication
- Encrypted account creation and management
- Token minting capabilities

### [SDK](./supra-sdk) 
TypeScript SDK providing:
- Protocol interaction methods
- Account management
- Token operations
- Type definitions

### [Contracts](./supra-contracts)
Move smart contracts implementing:
- Token standards
- Access control
- Protocol governance

### [Twitter Bot](./supranova-twitter-bot)
Twitter integration bot for:
- User authentication
- Command processing
- Automated responses

## Development

### Prerequisites
- Node.js v16+
- Git
- Move CLI

### Setup

```bash
# Clone repo with submodules
git clone --recursive https://github.com/yourusername/supranova

# Install dependencies
npm install
```

### Build

```bash
# Build all packages
npm run build
```

### Testing

```bash
# Run tests
npm test
```

## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and development process.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Resources

- [Documentation](https://docs.supra.com)
- [Lit Protocol Docs](https://developer.litprotocol.com)
- [Move Book](https://move-book.com)