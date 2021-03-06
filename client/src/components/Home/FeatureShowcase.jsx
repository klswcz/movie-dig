
function FeatureShowcase(props) {
    return (
        <div className="flex flex-row flex-wrap pt-12 px-10 xl:px-20">
            <div className="w-full grid xl:grid-cols-3 md:grid-cols-2">
                <div className="xl:max-w-lg md:pr-10 justify-self-end">
                    <img src={props.image} alt="Screenshot presenting the dashboard" className="ml-auto mr-auto mb-3 xl:mb-0"/>
                </div>
                <div className="text-md md:text-xl font-light text-gray-800 text-justify">
                    {props.description}
                </div>
            </div>
        </div>
    )
}

export default FeatureShowcase
