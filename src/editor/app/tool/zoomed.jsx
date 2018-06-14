
export const zoomed = (contentDimension, renderContent) => ({width, height}) => (
    <div className="zoomed">
        <div className="content" style={{
            left  : width/2- contentDimension.width/2,
            top   : height/2- contentDimension.height/2,
            width : contentDimension.width,
            height: contentDimension.height
        }}>
            {renderContent(contentDimension)}
        </div>
    </div>
);