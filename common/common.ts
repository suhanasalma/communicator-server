// Define isObject method
function isObject(value: any) {
    return typeof value === 'object' && value !== null;
}

// Export isEmpty function
exports.isEmpty = function(value: any) {
    return (
        (!value && value !== 0 && value !== false) 
        || (Array.isArray(value) && value.length === 0)
        || (isObject(value) && Object.keys(value).length === 0)
        || (typeof value.size === 'number' && value.size === 0)

        // `WeekMap.length` is supposed to exist!?
        || (typeof value.length === 'number'
            && typeof value !== 'function' && value.length === 0)
    );
};