# Introduction

Hey, welcome to the docs for ember-foxy-forms, this addon was built to do away with a lot of the needless plumbing when
building forms over data in ember. Common use cases like displaying validation errors, notifying the user on successful
submission, can all be very tedious in a typical ember application, with ember foxy forms this is trivial!

```js
class MyRoute extends Route {
   async model({model_id}) {
      return await this.store.find("model", model_id);
   }
}
```

```hbs
<Form
  @for={{this.model}}
  @successfulSubmitMessage="We did it!"
  @successfulDestroyMessage="Oh noes!"
  as |f|>
  <f.field @for="attribute" @using="input"/>
</Form>
```

## Custom Configurations

## Site-wide `environment.js` overrides

You can customize the way foxy forms handles various options by adding your override to your environment file.

```javascript
//environment.js

APP: {
  'ember-foxy-forms': {
    testingClassPrefix: '--',
    fieldClasses: 'field',
    formClasses: 'form',
    fieldForControlCalloutClasses: 'field-for-control-callout',
    fieldForControlCalloutPosition: 'bottom left',

    buttonClasses: '',
    submitButtonClasses: '',
    resetButtonClasses: '',

    customCommitCancelComponent: null,
    customErrorComponent: null
  }
}
```
