V 0.1.1 _Make it browserify_

<br/>

## Just one class...

<br/><br/>

# Internationalization

<br/><br/>

## Defaut walkthrough

<br/>

### First create the object with paths (like path.resolve(root, ...parts)) :

```typescript
const internationalization = new Internationalization(); // {cwd}/src/locales
const internationalization = new Internationalization(
  'my',
  'locales',
  'directory',
); // Path is resolved with process.cwd() as root
```

#### NB

1. The default path is {cwd}/src/locales
2. The locale must have at least a directory (
   locales/**<u>{locale}</u>**/common.json )
3. The locales must be json and can be namespaces (
   _locales/en/firstPage/header.json_ )

<br/>

### You can init translations sync

```typescript
const internationalization = new Internationalization();
internationalization.initSync();
```

<br/>

### Or async

```typescript
const internationalization = new Internationalization(
  'my',
  'locales',
  'directory',
);
await internationalization.init();
```

<br/>

### Then, you can get the string by method : <u>getKey</u>

```typescript
const internationalization = new Internationalization();
internationalization.initSync();
internationalization.getKey('title'); // => Title of the page
```

<br/>
<br/>

## Add-ons

<br/>

### Change Language : <u>changeLanguage</u>

By default language is set to English ('en')

```typescript
const internationalization = new Internationalization();
internationalization.initSync();
internationalization.getKey('title'); // => Title of the page
internationalization.changeLanguage('fr');
internationalization.getKey('title'); // => Titre de la page
```

<br/>

### Change Default Language : <u>Internationalization.defaultLanguage</u>

By default language is set to English ('en')

```typescript
Internationalization.defaultLanguage = 'fr';
const internationalization = new Internationalization();
internationalization.initSync();
internationalization.getKey('title'); // => Titre de la page
```

<br/>
<br/>

For tests, go to repo,
[here](https://github.com/chlbri/internationalization.git)

<br/>
<br/>

## Happy coding 😊❤️😊👨‍💻❤️✅!!
