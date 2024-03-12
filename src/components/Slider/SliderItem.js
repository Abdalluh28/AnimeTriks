import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addProduct } from "./Store/Slices/ProductsSlice";

function SliderItem(props) {
    let desc;
    if (props.showDesc) {
        desc = <p className="card-text"> {props.product.description} </p>
    }
    else
        desc = <></>

    let dispatch = useDispatch();
    let data = useSelector(state => state.Products);

    let flag = true;
    let addToCart = (product) => {
        dispatch(addProduct(product));
        let counter = document.querySelector(".badge").innerHTML;
        counter = parseInt(counter)+1;
        document.querySelector(".badge").innerHTML = counter;
        console.log(data)
    }
    return (
        <>
            <div className="card text-start m-2" style={ {width:"23%"} }>
                <img className="card-img-top" src={props.product.image} alt="Title" style={{height:"200px"}} />
                <div className="card-body">
                    <h4 className="card-title">{props.product.title}</h4>
                    <p className="card-text">{props.product.price}</p>
                    {desc}
                </div>
                <Link to={`product/${props.product.id}`}>View</Link>
                <button onClick={() => {
                    addToCart(props.product)
                }}>Add To Cart</button>
            </div>
            
        </>
    )
}

export default SliderItem;