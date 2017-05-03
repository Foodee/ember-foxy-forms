in-place-editing=true

show-control
  when in-place-editing=true && isEditing=true
  when in-place-editing=false 
  
show-value
  when in-place-editing=true && isEditing=false
  when in-place-editing=true && isEditing=true && has-pop-over=true

- isEditing can't be false when errors are present
