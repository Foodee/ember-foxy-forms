# Introduction

Forms can get *tedious*. Common use cases like displaying validation errors, or notifying the user on a successful submission
start to not not only feel repetitive, but also error prone. 

At [Food.ee](https://food.ee), we decided to get sly about this problem with `ember-foxy-forms`, an Ember form library that makes the 
everyday use cases trivial, while providing the flexibility to handle highly unique user requirements.

*💡 `ember-foxy-forms` was built with `ember-data` and `ember-model-validator` in mind, but it is not intrinsically tied to either of 
these libraries. You can use `ember-foxy-forms` with any data store that conforms to the JSON:API spec, or without any data store at all.*


## Overview

Generally speaking, using `ember-foxy-forms` is a quick, three-step process:

Supply an model or object to the form.

Then, specify to the fields which values they represent.

Finally, choose which form control to use for each field.


## Basic Example

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


## Getting Started

```bash
yarn add -D ember-foxy-forms
```

## Global Settings

You can customize the way `ember-foxy-forms` handles various options by adding your override to your environment file.

```javascript
//environment.js

APP: {
  'ember-foxy-forms': {
    testingClassPrefix: '--',
    fieldClasses: 'field',
    formClasses: 'form',
    fieldForControlCalloutClasses: 'field-for-control-callout',
    fieldForControlCalloutPosition: 'bottom left',
      
    // bem classes 
    bemClassPrefix: '',
    useBemClass: false,
      
    // required indicator 
    showRequiredIndicator: true,
    requiredText: '*',

    buttonClasses: '',
    submitButtonClasses: '',
    resetButtonClasses: '',

    customCommitCancelComponent: null,
    customErrorComponent: null
  }
}
```
