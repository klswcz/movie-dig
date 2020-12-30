
function FeatureShowcase(props) {
    return (
        <div className="flex flex-row flex-wrap pt-12 px-20">
            <div className="w-full grid grid-cols-3">
                <div className="max-w-lg pr-10 justify-self-end">
                    <img src={props.image} alt="Screenshot presenting the dashboard"/>
                </div>
                <div className="text-xl font-light text-gray-800 text-justify">
                    {props.description}
                </div>
            </div>
        </div>
    )
}

export default FeatureShowcase
