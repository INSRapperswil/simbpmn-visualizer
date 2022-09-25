function Button(props) {
    const {
        id,
        label,
        onClick
    } = props;


    return (
        <div class="bio-properties-panel-button">
            <input
                id={prefixId(id)}
                name={id}
                type="button"
                class="bio-properties-panel-input"
                value={label}
                onClick={onClick}/>
        </div>
    );
}


/**
 * @param {Object} props
 * @param {String} props.id
 * @param {String} props.label
 * @param {Function} props.onClick
 */
export default function ButtonEntry(props) {
    const {
        id,
        label,
        onClick
    } = props;


    return (
        <div class="bio-properties-panel-entry bio-properties-panel-checkbox-entry" data-entry-id={id}>
            <Button
                id={id}
                label={label}
                onClick={onClick}/>
        </div>
    );
}

// helpers /////////////////

function prefixId(id) {
    return `bio-properties-panel-${id}`;
}