# Controls

Ember foxy forms comes packed with support with the default set of html5 controls. They can be selected using the 'using' 
attribute.

{{#docs-demo as |demo|}}
  {{#demo.example name="controls.hbs"}}
      <Form @for={{this.model}} as |form|>
        <div class="columns">
          <div>
            <form.field @for="string" @using="input" @label="Text" />
            <form.field @for="text" @using="textarea" @label="Text" />
            <form.field @for="email" @using="email" @label="Email" />
            <form.field @for="url" @using="url" @label="Url" />
            <form.field @for="tel" @using="tel" @label="Telephone" />
            <form.field @for="search" @using="search" @label="Search" />
            <form.field @for="number" @using="number" @label="Number" />
            <form.field @for="number" @using="range" @label="Number Range" />
          </div>
          <div>
            <form.field @for="color" @using="color" @label="Color" />
            <form.field @for="date" @using="date" @label="Date" />
            <form.field @for="time" @using="time" @label="Time" />
            <form.field @for="datetime" @using="datetime" @label="Datetime" />
            <form.field @for="boolean" @using="checkbox" @label="Boolean" />
            <form.field 
              @for="select"
              @using="select" 
              @label="Select"
              @values="1:one,2:two,3:three"
             />
            <form.field 
              @for={{array "start" "end"}} 
              @using="multiple-input" 
              @label="Multiple Input"
             />
          </div>
        </div>
      </Form>
  {{/demo.example}}
  {{demo.snippet "controls.hbs"}}
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

By default Foxy Forms looks for your custom controls in the component directory form-controls, but you can also specify the
full path to the control.

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
