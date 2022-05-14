import React,{useState,useEffect} from 'react'
// import Pagination from './Pagination'
import ReactPaginate from 'react-paginate'
import Swal from 'sweetalert2'
import Nav from './Nav'

export default function App() {
    const [items, setItems] = useState([])
    const [pageCount, setPageCount] = useState(0)
    
    const getPosts = async () => {
        // const res = await fetch(`http://localhost:3004/posts?_page=1&_limit=${limit}`)
        const res = await fetch(`http://localhost:3004/posts?_page=1`)
        const data = await res.json()
        const total = res.headers.get('x-total-count')
        console.log(total);
        let limit = 10;
        setPageCount(Math.ceil(total/limit))
        setItems(data)
    }

    useEffect(() => {
        getPosts()
    }, [])
    console.log(items);

    const fetchPosts = async (currentPage) => {
        const res = await fetch(`http://localhost:3004/posts?_page=${currentPage}`)
        const data = await res.json()
        return data
    }
    const handlePageClick = async (data) => {
        console.log(data.selected);
        let currentPage = data.selected + 1;

        const postFormServer = await fetchPosts(currentPage);
        setItems(postFormServer);
    }
    const onDelete = async (id) => {
        await fetch(`http://localhost:3004/posts/${id}`,{
            method: 'DELETE',
        })
        .then(res => {
            if(res.status !== 200) {
                return
            }else {
                setItems(items.filter(data => {
                    return data.id !== id;
                }))
                // return res.json();
            }
        })
        // .then(data => {
        //     setItems([data])
        // })
        .catch(err => {
            console.log(err);
        })
    }
    const onAdd = async (title,body,id,e) => {
        await fetch('http://localhost:3004/posts/',{
            method:'POST',
            body: JSON.stringify({
                id:id,
                title:title,
                body:body,
            }),
            headers:{
                "Content-type" : "application/json; charset=UTF-8",
            }
        })
        .then(res => {
            if(res.status !== 201) {
                return
            }else {
                return res.json();
            }
        })
        .then(data => {
            setItems([...items,data])
        })
        .catch(err => {
            console.log(err)
        })
        console.log(onAdd);
    }
    
    const onEdit = async (title,body,id,e,userId) => {
        await fetch(`http://localhost:3004/posts/${id}`,{
            method: 'PUT',
            body: JSON.stringify({
                id:id,
                title:title,
                body:body,
            }),
            headers:{
                "Content-type" : "application/json; charset=UTF-8",
            }
        })
        .then(data => {
            setItems([...items,data])
        })
        .catch(err => {
            console.log(err)
        })
        console.log(onEdit);
        // console.warn('items', item)
    }

    const handleEdit = async(e) => {
        console.warn(onEdit);
        // const { value: formValues } = await Swal.fire({
        //     title: 'Update Object',
        //     html:
        //       `<input id="swal-input1" placeholder="Title" title="title" class="swal2-input" value=${e.target.title}>` +
        //       `<input id="swal-input2" placeholder="Body" name="name" class="swal2-input" value=${e.target.name}>`,
        //     focusConfirm: false,
            
        //     preConfirm: () => {
        //         onEdit(document.getElementById('swal-input1').value,
        //     document.getElementById('swal-input2').value)
        //       return [
        //         document.getElementById('swal-input1').value,
        //         document.getElementById('swal-input2').value,
        //       ]
        //     },
        //     showCancelButton: true
        //   })
          
        //   if (formValues) {
        //     Swal.fire(JSON.stringify(formValues))
            
        //     // onAdd(e.target.title.value,e.target.name.value,)
        //   }
    }

    const handleDelete = async(e,id) => {
        e.preventDefault()
        console.log(e.target.id);
        // alert(id)
        // confirm('hello')
    //     const weatherForecast = `
    //   Today in <strong>${this.state.cityName}</strong>
    //   weather will be with <strong>${today.weather_state_name}</strong>,
    //   min temperature <strong>${parseInt(today.min_temp)}°C</strong>,
    //   max temperature <strong>${parseInt(today.max_temp)}°C</strong>,
    //   and humidity will be <strong>${today.humidity}%</strong>
    // `;
        Swal.fire({
            title: 'Are you sure?',
            html: `<strong class="text-danger">UserId: ${e.target.name} Id: ${e.target.id}</strong>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.isConfirmed) {
                onDelete(e.target.id)
              Swal.fire(
                'Deleted!',
                `Deleted Object <strong class="text-success">UserId: ${e.target.name} Id: ${e.target.id}</strong>`,
                'success'
              )
            }
          })
    }
  return (
    // <Pagination itemsPerPage={4} />
    <>
    <Nav onAdd={onAdd}/>
    <div className='container mt-5'>
        <div className='row m-2'>
    {
        items.map(item => {
            return(
                <div key={item.id} className='col-sm-6 col-md-6 v my-2'>
                <div className='card shadow-sm w-100' style={{minHeight:'200px'}}>
                    <div className='card-body'>
                        {/* <h5 className='card-title text-center h2'>Id : {item.id}</h5> */}
                        <h6 className='card-subtitle mb-2 text-muted text-center'><span className='text-success'>Title :</span><br/>{item.title}</h6>
                        <p className='card-text text-center'><span className='text-danger bold'>Body :</span><br/>{item.body}</p>
                        <span className='d-flex justify-content-evenly'>
                        <button type='button' className='btn btn-info' title={item.title} name={item.body} id={item.id} onClick={handleEdit}>Edit</button>
                        <button type='button' className='btn btn-danger' name={item.userId} id={item.id} onClick={handleDelete}>Delete</button>
                        </span>
                    </div>
                </div>
                </div>
            )
        })
    }
    </div>
    </div>
        <ReactPaginate
            previousLabel={'Previous'}
            nextLabel={'Next'}
            breakLabel={'...'}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={'pagination justify-content-center'}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link'}
            previousClassName={'page-item'}
            nextClassName={'page-item'}
            previousLinkClassName={'page-link'}
            nextLinkClassName={'page-link'}
            breakClassName={'page-item'}
            breakLinkClassName={'page-link'}
            activeClassName={'active'}
        />
    </>
  )
}
