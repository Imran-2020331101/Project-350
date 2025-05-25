const expenseSchema = new mongoose.Schema({
    expenseID: { type: String, required: true, unique: true },
    userID: { type: String, required: true, ref: 'User' },
    category: String,
    amount: Number,
    date: Date,
    description: String,
});

module.exports = mongoose.model('Expense', expenseSchema);