# Form Features in detail

FoxyForms is a fully featured form framework, mostly designed for dealing with ember-data models. It comes with a number
of features that make composing UIs very simple.

## Value & Error Mapping

The primary role of FoxyForms is to map errors / values from a model to various form controls. The assume structure of
the model looks something like this:

{{#docs-snippet name="model.js"}}
  {
    value: "foo",
    errors: {
      value: [
        "An Error",
        "An other error"
      ]
    }
  }
{{/docs-snippet}}


This schema is consistent with ember-data, JSON:API spec, and ember-model-validator.

When an error is present ember foxy-forms will add error classes to the forms / fields.

## Automatic Submission Mode

When in automatic submission mode, the form will automatically trigger the submission action when a change is committed
by a field.

{{#docs-demo as |demo|}}
  {{#demo.example name="auto-submit.hbs"}}
    <Form @for={{this.object}} @onSubmit={{this.handleSubmit}} @autoSubmit={{true}} @successfulSubmitMessage='Submitted' as |f|>
      <f.field @for="attribute" />
    </Form>
  {{/demo.example}}
  {{demo.snippet "auto-submit.hbs"}}
{{/docs-demo}}

## Disabled & Readonly 

A form can be disabled, which will apply the style 'disabled' to all sub-fields, it will also disable any controls in the 
form as well.

A form can be placed in readonly mode, which is similar to disabled, however it does not disabled the controls. You must
must manually implement this mode at the control level, it can be helpful for forms where you might want to copy data.
(disabled controls typically do not respond to mouse events).

### Disabled 

{{#docs-demo as |demo|}}
  {{#demo.example name="disabled.hbs"}}
    <Form @for={{this.object}} @disabled={{true}} as |f|>
      <f.field @for="attribute" />
    </Form>
  {{/demo.example}}
  {{demo.snippet "disabled.hbs"}}
{{/docs-demo}}

### Readonly

{{#docs-demo as |demo|}}
  {{#demo.example name="readonly.hbs"}}
    <Form @for={{this.object}} @readonly={{true}} as |f|>
      <f.field @for="attribute" />
    </Form>
  {{/demo.example}}
  {{demo.snippet "readonly.hbs"}}
{{/docs-demo}}

## Inline Editing Mode

In inline editing mode, form values are represented as text, when you click on that text they are replaced with a control
and a set of confirm/reject buttons. Any changes made to the value will only be committed to the parent model when you click
the confirm button. If you click the reject button the changes will be rolled back.

{{#docs-demo as |demo|}}
  {{#demo.example name="inline.hbs"}}
    <Form @for={{this.object}} @inlineEditing={{true}} as |f|>
      <f.field @for="attribute" />
    </Form>
  {{/demo.example}}
  {{demo.snippet "inline.hbs"}}
{{/docs-demo}}

## Notification

Forms can be configured to notify the user when a form either succeeds or fails. This behaviour is configurable as follows:

{{#docs-demo as |demo|}}
  {{#demo.example name="notification.hbs"}}
    <Form 
      @for={{object}} 
      @successfulSubmitMessage="Hello World" 
      @successfulResetMessage="Hello World" 
      as |f|>
      <f.field @for="foo" @using="input"/>
      <f.submit />
      <f.reset />
    </Form>
  {{/demo.example}}
  {{demo.snippet "notification.hbs"}}
{{/docs-demo}}

{{#docs-snippet name="initialize.js"}}
  export function initialize(appInstance) {
    const formFor = appInstance.lookup("service:form-for");
    const notify = appInstance.lookup("service:notify");
  
    formFor.notifySuccess = function (message) {
      notify.success(message);
    };
  
    formFor.notifyError = function (message) {
      notify.error(message);
    };
  
  }
  
  export default {
    name: "form-for",
    initialize: initialize
  };
{{/docs-snippet}}

The form-for service can be extended to provide custom popups, or messages by injecting it into your application.

## Errors

By default ember-foxy-forms wires errors from ember-data models. 


### scrollToFirstVisibleError

You can configure a form to scroll its first field with an error into view on failed submission. Using the scrollToFirstVisibleError options.

## Navigation Guards

By default a dirty form will require confirmation of navigation both of the ember-router and the browser. The form-for
service can be extended to provide custom popups, or messages by injecting it into your application.


{{#docs-snippet name="navigation.js"}}
  class SomeController extends Controller {
  
    @service
    formFor;
  
    constructor(...args) {
      super(...args);
  
      this.service.confirmDestroyModel = (model, message) => this.confirmDestroy(model, message);
    }
  
    confirmDestroyModel(model, message) {}
  
  }
{{/docs-snippet}}

## Lifecycle hooks

FoxyForms exposes a number of lifecycle hooks that allow for the extension of its three primary actions 'submit' 'reset' 'destroy'.


### confirm(Submit|Reset)

{{#docs-snippet name="will.js"}}
  confirmSubmit(model):Promise[boolean]
  confirmSubmit(model):Promise[boolean]
{{/docs-snippet}}

Called at the beginning of the submit / reset process, expected to be a function which returns a promise for a boolean that is used to determine whether to continue the process.

### will(Submit|Reset|DestroyModel)

{{#docs-snippet name="will.js"}}
  willSubmit(model):boolean
  willReset(model):boolean
  willDestroyModelModel(model):boolean
{{/docs-snippet}}

Called at the beginning of the process, expected to be a function which returns a boolean that is used to determine whether or
not to continue the process.

### didNot(Submit|Reset|DestroyModel)

Called when the will(Submit|Reset|DestroyModel) function returns false.

### on(Submit|Reset|DestroyModel)

{{#docs-snippet name="on.js"}}
  onSubmit(model):Promise
  onReset(model):Promise
  onDestroyModelMode(model):Promise
  onMarkedDirty():void
  onMarkedClean():void
{{/docs-snippet}}

Called when the will(Submit|Reset|DestroyModel) function returns true, does the actual submission, resetting, or destruction.
You may replace any of the functions with a function that returns a Promise.

### did(Submit|Reset|DestroyModel)

Called when the on(Submit|Reset|DestroyModel) function successfully runs

### failedSubmit

Called when the on(Submit|Reset|DestroyModel) function fails to run

### confirmDestroyModel

Called when the destroy button is pressed, by default runs the code found in the form-for service to confirm the destruction
of the model.

### On Marked Dirty

Called when the form becomes dirty 

### On Marked Clean

Called when the form becomes clean 

## Wrapping Tag

Sometimes you'd like a form to be a row in a table instead of an actual form tag.

{{#docs-snippet name="tagName.js"}}
  <Form @tagName='tr' as |tr| />
{{/docs-snippet}}

## Testing classes

Form for will automatically generate some testing classes on both the form and the field. They take the following pattern:

NOTE: these will be deprecated

forms: '--form-for\_\_model-name'

fields: '--form-for\_\_model-name_key(s)'

## Testing Selectors

forms: ```[data-test-form-for] [data-test-resource-id=<model-name>]```

fields ```[data-test-field-for] [data-test-resource-id=<model-name>-<params>]```

## Bem classes

Form for will automatically generate [BEM style](http://getbem.com) classes on its elements.
This feature can be turned on either by setting `useBemClass` to `true` in the config or passing it as an arg.

{{#docs-snippet name="bemClass.hbs"}}
  <Form @useBemClass={{true}} />
{{/docs-snippet}}

If `bemClassPrefix` is provided in the config, it will use it as a prefix of the classes.

forms: ```form-for-model-name```

fields: ```form-for-model-name__field-for-field-name```

buttons: ```form-for-model-name__button-type-button```

## CSS Grid Helpers

{{#docs-snippet name="useGridTemplate.hbs"}}
  <Form @useGridTemplate={{true}} as |f|>
    <f.field  @name="email"     />
    <f.field  @name="password" />
    <f.submit                  />
  </Form>
{{/docs-snippet}}

Form for will automatically generate [grid-areas](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-area) defined 
as inline styles on its elements. This feature can be turned on either by setting `useGridTemplate` to `true` in the 
config or passing it as an arg. This allows you to define your form layout using the [grid-template](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template)
syntax. 

With the above form, achieving a two-column layout for the email and password fields can be accomplished with the following CSS:

```css
.form-for {
  display: grid;
  grid-gap: 1rem;
  grid-template-areas:
    'email  password'
    'submit submit  ';
}
```

If `gridTemplatePrefix` is provided in the config, it will use it as a prefix for the grid area names.

```css
.form-for {
  grid-template-areas:
    'ff-email  ff-password'
    'ff-submit ff-submit  ';
}
```

## Required Field Text

If a form's model has validations (currently only ember-model-validator) then it can be configured to display a required 
indicator in the label. This text can be configured at the environment level, and the form level. You can also override
the required value as an argument.
