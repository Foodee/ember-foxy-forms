# Controls

Ember foxy forms comes packed with support with the default set of html5 controls, as well as a few 'emberized' ones that
make interacting with ember-data / ember-objects a little more straight forward. They can be selected using the 'using' 
attribute. If you provide no ```@using``` or ```@control``` attribute the form will default to using the text type. 

## Text Input Variants 

{{#docs-demo as |demo|}}
  {{#demo.example name="text-input.hbs"}}
    <Form @for={{this.model}} as |form|>
      <form.field @for="string" @using="input" @label="Text" />
      <form.field @for="string" @using="password" @label="Password" />
      <form.field @for="password" @using="input" @label="Password" />
      <form.field @for="email" @using="email" @label="Email" />
      <form.field @for="url" @using="url" @label="Url" />
      <form.field @for="tel" @using="tel" @label="Telephone" />
      <form.field @for="search" @using="search" @label="Search" />
      <form.field @for="number" @using="number" @label="Number" />
    </Form>
  {{/demo.example}}
  {{demo.snippet "text-input.hbs"}}
{{/docs-demo}}

## Textarea

{{#docs-demo as |demo|}}
  {{#demo.example name="textarea-control.hbs"}}
      <Form @for={{this.model}} as |form|>
        <form.field @for="text" @using="textarea" />
      </Form>
  {{/demo.example}}
  {{demo.snippet "textarea-control.hbs"}}
{{/docs-demo}}

## Range Slider 

{{#docs-demo as |demo|}}
  {{#demo.example name="range-control.hbs"}}
      <Form @for={{this.model}} as |form|>
        <form.field @for="number" @using="range" />
      </Form>
  {{/demo.example}}
  {{demo.snippet "range-control.hbs"}}
{{/docs-demo}}

## Color Selector 

{{#docs-demo as |demo|}}
  {{#demo.example name="color-control.hbs"}}
      <Form @for={{this.model}} as |form|>
        <form.field @for="color" @using="color" />
      </Form>
  {{/demo.example}}
  {{demo.snippet "color-control.hbs"}}
{{/docs-demo}}

## Date & Time Selector 

{{#docs-demo as |demo|}}
  {{#demo.example name="date-time-control.hbs"}}
      <Form @for={{this.model}} as |form|>
        <form.field @for="date" @using="date" @label="Date" />
        <form.field @for="time" @using="time" @label="Time" />
        <form.field @for="datetime" @using="datetime" @label="Datetime" />
      </Form>
  {{/demo.example}}
  {{demo.snippet "date-time-control.hbs"}}
{{/docs-demo}}

## Checkbox 

A checkbox can take an optional label attribute.

{{#docs-demo as |demo|}}
  {{#demo.example name="checkbox-control.hbs"}}
      <Form @for={{this.model}} as |form|>
        <form.field @for="boolean" @using="checkbox" @label="Boolean" as |ff|>
          <ff.control @label="Checkbox Label" />
        </form.field>
      </Form>
  {{/demo.example}}
  {{demo.snippet "checkbox-control.hbs"}}
{{/docs-demo}}

## Select 

FoxyForms comes with two select controls out of the box that work with both primitive arrays (numbers and strings) or 
ember objects. When working with objects you can specify an identifier key `@idKey` and a label key `@labelKey`
these will be used to identify your object and to label the drop down.
Also you can disable an option by setting `disabled: true` in your value object in values array.

{{#docs-demo as |demo|}}
  {{#demo.example name="select-control.hbs"}}
      <Form @for={{this.model}} as |form|>
        <form.field 
          @for="objectSelect"
          @using="select" 
          @label="Object Select"
          @values="1:one,2:two,3:three"
         />
        <form.field 
          @for="objectSelecttWithDisabledOption"
          @using="select" 
          @label="Object Select With Disabled Option"
          @values={{this.valuesForSelectObjectWithDisabledOption}} {{!-- [{ id: '1', label: 'one' }, { id: '2', label: 'two', disabled: true }, { id: '3', label: 'three' }] --}}
         />
        <form.field 
          @for="primitiveSelect"
          @using="select" 
          @label="Primitive Select"
          @values="1,2,3"
         />
        <form.field
          @for="objectCheckboxSelect"
          @using="checkbox-select"
          @label="Object Select"
          @values="1:one,2:two,3:three"
         />
        <form.field
          @for="objectCheckboxSelect"
          @using="checkbox-select"
          @label="Object Select With Custom Label"
          @values="1:one,2:two,3:three"
          as |ff|
         >
          <ff.control as |value id|>
            <label for={{id}}>
              <strong>Custom Checkbox <em>Select</em></strong>: {{value.label}}
            </label>
          </ff.control>
        </form.field>
        <form.field 
          @for="primitiveCheckboxSelect"
          @using="checkbox-select" 
          @label="Primitive Select"
          @values="1,2,3"
         />
        <form.field
          @for="radio"
          @using="radio"
          @label="Radio Control"
          @values="1:One,2:Two,3:Three"
         />
        <form.field
          @for="radioCustom"
          @using="radio"
          @label="Custom Radio Control Label"
          @values="1:One,2:Two,3:Three"
          as |ff|
          >
          <ff.control @noneText="None" as |value id|>
            <label for={{id}}>
              <strong>Custom Radio<em>Select</em></strong>: {{value.label}}
            </label>
          </ff.control>
        </form.field>
      </Form>
  {{/demo.example}}
  {{demo.snippet "select-control.hbs"}}
{{/docs-demo}}

## Custom Controls

You can extend form for to provide custom controls, your component must simply conform to the control interface:

A form control is any component which implements the following interface.

{{#docs-snippet name="custom-controls.js"}}
  interface FormControl {
    // current value of the control
    value: any; 
    // optional list of values to select from (handy for buidling selects)
    values: array; 
    // passed in by the field layer to identify your control
    controlId: string; 
    // optional placeholder text
    placeholder: string; 
    // whether or not this control is disabled
    disabled: boolean; 
    // whether or not this control is readonly
    readonly: boolean; 
    // callback function when the values controlled by this control is changed
    onChange(){}; 
  }
{{/docs-snippet}}

If you follow this convention values will be seamlessly managed by the field / form layers. Some examples of custom controls
we have built are: 

- Image Select Control
- Map Editor Control
- Price Range Select
- Rich Text editor
- JSON editor

By default Foxy Forms looks for your custom controls in the component directory form-controls of your application, 
but you can also specify the full path to the control.

{{#docs-demo as |demo|}}
  {{#demo.example name="custom-controls-usage.hbs"}}
      <Form @for={{this.object}} as |form|>
        <form.field @for="number" @using="custom" />
        <form.field @for="number" @control="form-controls/ff-custom" />
      </Form>
  {{/demo.example}}
  {{demo.snippet "custom-controls-usage.hbs"}}
{{/docs-demo}}

## Control Paths and Prefixes

TODO: 
