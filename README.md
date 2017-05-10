# ember-foxy-forms


[![Code Climate](https://codeclimate.com/repos/59076c1d310eda02ab000350/badges/7269e6fd35928949f93f/gpa.svg)](https://codeclimate.com/repos/59076c1d310eda02ab000350/feed) [![Test Coverage](https://codeclimate.com/repos/59076c1d310eda02ab000350/badges/7269e6fd35928949f93f/coverage.svg)](https://codeclimate.com/repos/59076c1d310eda02ab000350/coverage) [![Issue Count](https://codeclimate.com/repos/59076c1d310eda02ab000350/badges/7269e6fd35928949f93f/issue_count.svg)](https://codeclimate.com/repos/59076c1d310eda02ab000350/feed) [ ![Codeship Status for Foodee/ember-foxy-forms](https://app.codeship.com/projects/caace390-10be-0135-bdfd-42a6c56c937f/status?branch=master)](https://app.codeship.com/projects/216394)

Not just forms, Foxy Forms.

This addon allows you to build simple declarative forms with some snazy features. It is UI framework agnostic and generates 
minimal dom, so as to not interfere with what ever UI framework you might be using.

More documentation to come.

## FormFor

A form controls a single model, it exposes two context variables, the form component builder, and the form itself.

The form component builder exposes 4 components:

- field_for: a container for form controls mapped to one or more model field values
- submit: a button which triggers the submit process on the form (calls validate on the mode, and tries to save it)
- reset: a button which triggers the reset process on the form (current doesn't do much)
- destroy: a button which triggers the destroy process on the form


### Configuration Values


```javascript
const FormFor = {
  // Whether or not this form is disabled, delegated to all fields
  disabled: false,
 
  // Whether or not this form is readonly, delegated to all fields
  readonly: false,
 
  // Whether or not this form uses inline editing by default
  // in this mode the form will display text values, which can be
  // clicked to edit
  'inline-editing': false,
  
   // Whether or not all of the fields on this form require confirm before 
   // committing their values to the model
  'require-confirm': false,
  
   // Whether or not this form auto submits on commit of a value (useful for inline editing)
  'auto-submit': false,
 
  // Whether or not you want notifications on success or failure
  

  'notify-of-success': true,
  'notify-of-error': true,
  
  'successful-submit-message': null,
  'failed-submit-message': null,
  
  'successful-reset-message': null,
  'failed-reset-message': null,
  
  'successful-destroy-message': null,
  'failed-destroy-message': null,

 
  // options passed to the validation method if present
  'validation-options': {} 
}
```

### Life Cycle Events

#### willSubmit

Called at the beginning of the submit process, expected to be a function which returns a boolean.

#### didNotSubmit

Called when the willSubmit function returns false

#### onSubmit

Called when the willSubmit function returns true, does the actual submission, in the case of ED models calls save. 

#### didSubmit

Called when the onSubmit function successfully runs 
 
#### failedSubmit

Called when the onSubmit function fails to runs

### confirmDestroy

Called when the destroy button is pressed, by default runs the code found in the form-for service to confirm the destruction
of the model.

```handlebars

{{#form-for model as |f form|}}

{{/form-for}}
```

## FieldFor

Fields extract values from the model and pass them down to form controls, which are specified with the 'using' property.

```handlebars
{{#form-for model as |f|}}

  {{f.field-for 'foo' using='input' label='Foo'}}

{{/form-for}}
```

Multiple values can be extracted by providing multiple keys to the field-for helper.

```handlebars
{{#form-for model as |f|}}

  {{f.field-for 'startDate' 'endDate' using='date-range' label='Date Range'}}
  
  {{f.submit}}

{{/form-for}}
```

This will expose a pojo of {startDate, endDate} to the form control. That control must then emit onChange events with 
pojos containing the same key value mappings.

Alternatively you can use the with-mapping property to provide value mapping. This is useful for making generic components.

```handlebars
{{#form-for model as |f|}}

  {{f.field-for 'foo' 'bar' using='date-range' with-mapping=(hash foo='start-date' bar='end-date') label='Date Range'}}
  
  {{f.field-for 'baz' 'quz' using='date-range' with-mapping=(hash baz='start-date' qux='end-date') label='Date Range'}}
  
  {{f.submit}}

{{/form-for}}
```

# FormControls

A form control is any component which implements the following interface.

TODO: more stuff on the various configurations

```
value: *, // current value of the control
values: [], // optional list of values to select from (handy for buidling selects)
controlId: '', // passed in by the field layer to identify your control
placeholder: '', // optional placeholder text
disabled: true | false, // whether or not this control is disabled
readonly: true | false, // whether or not this control is readonly

onChange(){} // callback function when the values controlled by this control is changed
```


## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember serve`
* Visit your app at http://localhost:4200.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).
