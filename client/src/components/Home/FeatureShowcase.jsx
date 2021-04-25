function FeatureShowcase(props) {
    return (

        <div className="col-span-2 justify-self-end mb-16 sm:mx-16 border border-gray-400 rounded-lg shadow-lg">
            <img src={props.image} className="rounded-t-md ml-auto mr-auto mb-3 xl:mb-0"/>
            <p className="mt-2 text-justify text-gray-900 text-lg p-6">
                {props.description}
            </p>
        </div>
    )
}

export default FeatureShowcase
