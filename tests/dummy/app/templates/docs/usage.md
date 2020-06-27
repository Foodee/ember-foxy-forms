# Usage 

Below is a configurable example of the basic usage of ember-foxy-forms, it showcases all of the htm5 input controls
that can be mounted to your data model.

The various features can be toggled on / off below.

{{#docs-demo as |demo|}}
  {{#demo.example name="basic-usage.hbs"}}
      <Form
        @for={{this.anObject}} 
        
        @readonly={{this.readonly}} 
        @disabled={{this.disabled}} 
        @inlineEditing={{this.inline}} 
        @hasControlCallout={{this.hasControlCallout}} 
        @autoSubmit={{this.autoSubmit}} 
        
        @successfulSubmitMessage={{this.successfulSubmitMessage}}
        @willSubmit={{this.willSubmit}}
        @onSubmit={{this.submit}}
        @didSubmit={{this.didSubmit}}
        @didNotSubmit={{this.didNotSubmit}}
       
        @successfulResetMessage={{this.successfulResetMessage}}
        @willReset={{this.willReset}}
        @onReset={{this.reset}}
        @didReset={{this.didReset}}
        @didNotReset={{this.didNotReset}}
        
        @successfulDestroyMessage={{this.successfulDestroyMessage}}
        @willDestroy={{this.willDestroy}}
        @onDestroy={{this.destroy}}
        @didDestroy={{this.didDestroy}}
        @didNotDestroy={{this.didNotDestroy}}
      as |form|>
        <h2 class="docs-md__h2">Form</h2>
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
              @label="Composite Input" 
            />
          </div>
        </div>
         <form.submit/>
         <form.reset/>
         <form.destroy/>
         <h2>Logs</h2>
         <ul>
          {{#each this.logs as |log|}}
            <li>{{log}}</li>
          {{/each}}
         </ul>
      </Form>
      <div>
        <div>
          <h2 class="docs-md__h2">Model</h2>
          <pre class="hljs model"><code>{{json-pretty-print this.anObject}}</code></pre>
        </div>
      </div>
  {{/demo.example}}
  {{demo.snippet "basic-usage.hbs"}}
{{/docs-demo}}

<h1>Features</h1>
<Form @for={{this}} as |form|>
  <form.field 
    @for="errors" 
    @using="checkbox" 
    @didCommitValue={{this.toggleErrors}}
  as |f|>
    <f.control @label="Errors" />
  </form.field>
  <form.field @for="inline" @using="checkbox" as |f|>
    <f.control @label="Inline Editing" />
  </form.field>
  <form.field @for="hasControlCallout" @using="checkbox" as |f|>
    <f.control @label="Has Control Callout" />
  </form.field>
  <form.field @for="autoSubmit" @using="checkbox" as |f|>
    <f.control @label="Auto Submit" />
  </form.field>
  <form.field @for="disabled" @using="checkbox" as |f|>
    <f.control @label="Disabled" />
  </form.field>
  <form.field @for="readonly" @using="checkbox" as |f|>
    <f.control @label="Readonly" />
  </form.field>
  <div class="columns">
    <div>
      <h2>Submit</h2>
      <form.field @for="enableSubmit" @using="checkbox" class="push-right" as |f|>
        <f.control @label="Enabled" />
      </form.field>
      <form.field 
        @for="successfulSubmitMessage"
        @label="Success"
        @using="input" 
       />
      <form.field 
        @for="failedSubmitMessage"
        @label="Failed"
        @using="input" 
       />
    </div>
    <div>
      <h2>Reset</h2>
      <form.field @for="enableReset" @using="checkbox" class="push-right" as |f|>
        <f.control @label="Enabled" />
      </form.field>
      <form.field 
        @for="successfulResetMessage"
        @label="Success"
        @using="input" 
       />
      <form.field 
        @for="failedResetMessage"
        @label="Failed"
        @using="input" 
       />
    </div>
    <div>
      <h2>Destroy</h2>
      <form.field @for="enableDestroy" @using="checkbox" class="push-right" as |f|>
        <f.control @label="Enabled" />
      </form.field>
      <form.field 
        @for="successfulDestroyMessage"
        @label="Success"
        @using="input" 
       />
      <form.field 
        @for="failedDestroyMessage"
        @label="Failed"
        @using="input" 
       />
    </div>
   </div>
</Form>

