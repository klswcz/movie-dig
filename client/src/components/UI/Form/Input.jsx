
function Input(props) {

    return (
        <div>
            <label htmlFor={props.name ?? props.id} className="capitalize">{(props.name ?? props.label).replace('_', ' ')}</label>

            <input id={props.name ?? props.id} name={props.name} value={props.value} type={props.type} autoComplete={props.type} onChange={props.onChange}
                   className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                   placeholder={props.placeholder} required={props.required}/>
        </div>
    )
}

export default Input;
