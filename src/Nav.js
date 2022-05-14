import React from 'react'
import Swal from 'sweetalert2'

export default function Nav({onAdd}) {
    const handleAdd = async(e) => {
        const { value: formValues } = await Swal.fire({
            title: 'Add Object',
            html:
              `<input id="swal-input1" placeholder="Title" title="title" class="swal2-input" value=${e.target.title}>` +
              `<input id="swal-input2" placeholder="Body" name="name" class="swal2-input" value=${e.target.name}>`,
            focusConfirm: false,
            
            preConfirm: () => {
                onAdd(document.getElementById('swal-input1').value,
            document.getElementById('swal-input2').value)
              return [
                document.getElementById('swal-input1').value,
                document.getElementById('swal-input2').value,
              ]
            },
            showCancelButton: true
          })
          
          if (formValues) {
            Swal.fire(JSON.stringify(formValues))
            
            // onAdd(e.target.title.value,e.target.name.value,)
          }
    }
  return (
    <>
    <nav className="navbar navbar-default navbar-fixed-top">
  <div className="container-fluid bg-primary fixed-top position-fixed"  style={{width:'100%',height:'50px'}}>
  <h4 className='text-white ms-2'>Assigment</h4>
  <button type='button' className='btn btn-warning text-success fw-bold' onClick={handleAdd}>Add Object</button>
  </div>
</nav>
    </>
  )
}
