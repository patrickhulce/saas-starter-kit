# saas-starter-kit

Everything you need to get your next Unicorn-for-x startup off the ground.

## Getting Started

1.  Replace all the strings
    - sed -i s/saas-starter-kit/your-real-product-name/
    - sed -i s/the-product/your-real-product-name/
    - sed -i s/the_product_db/your_database_name/
1.  Replace values in `.envrc`
1.  Replace values in `packages/shared/lib/conf.ts`

## Toolchain

### [nvm](https://github.com/creationix/nvm)

```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```

### nvm

```
nvm install v10
nvm alias default v10
nvm use v10

npm install -g yarn jest
```

### awscli

```
pip install awscli --user
```

#### Working with `.envrc`

It's nice to automatically setup your shell environment when you enter the project directory

Options: [direnv](https://direnv.net/), [ondir](https://swapoff.org/ondir.html), [zsh chpwd](http://www.refining-linux.org/archives/42/ZSH-Gem-8-Hook-function-chpwd/)

```bash
brew install direnv
echo '\n# automatically load .envrc files\neval "$(direnv hook zsh)"' >> ~/.zshrc
source ~/.zshrc
```
