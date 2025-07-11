const internalError = (req, res) => {
    res.status(500).json({ message: "Internal Server Error" });
}

export default internalError;