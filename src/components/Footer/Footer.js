export function Footer() {
    return (
        <div className="d-flex justify-content-center align-items-center flex-column mb-5" style={{zIndex:'20000'}}> 
            <h2>AnimeTrix</h2>
            <div className="w-75 text-center my-4">AnimeTrix is not affiliated with or endorsed by any of the anime studios behind the creation of the anime presented on this site. This website is only a user interface presenting/linking various self-hosted files across the internet by other third-party providers for easy access. AnimeTrix never downloads the video from any source provider, link will be returned from the response hence it is completely not subjected to DMCA compliant.</div>
            <div>
                <a href="https://github.com/Abdalluh28" className="m-3"><i className="fa-brands fa-github " style={{fontSize:"32px"}}></i></a>
                <a href="https://www.linkedin.com/in/abdo-khaled-34235b283/" className="m-3"><i className="fa-brands fa-linkedin-in " style={{fontSize:"32px"}}></i></a>
            </div>
            <div className="d-md-none" style={{marginTop:'150px'}}></div>
        </div>
    )
}