import {useMap} from 'react-leaflet';

function ChangeMapView({center,zoom}) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}
export default ChangeMapView