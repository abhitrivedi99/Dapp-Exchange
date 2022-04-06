# DAPP Exchange (WAYNE)

This is Practical tutorial of Dapp Exchange token with React.

## Dependencies

```
- Solidity Compiler
- Truffle
- Ganache
- NodeJS
- Metamask
```

### Deployment of smart contarct

```
- Open Ganache
- truffle migrate --reset
- truffle exec scripts/seed-exchange.js
```

### Test smart contarct

```
- Open Ganache
- truffle test
```

### Steps to run

Make sure metamask is installed and running on network as same as ganache(http://localhost:7545).

1. Install Dependencies

```
npm install
```

2. Start development server

```
npm start
```

3. If you want to run build

```
- npm run build
- npm i -g server
- serve -s build
```

4. Get Private key from Ganache's any account (Prefereable first one)
5. Import that account in metamask and connect with site.
6. You are all set!
