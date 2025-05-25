const languageTranslationSchema = new mongoose.Schema({
    translationID: { type: String, required: true, unique: true },
    userID: { type: String, required: true, ref: 'User' },
    originalText: String,
    translatedText: String,
    translationDate: Date,
    languageFrom: String,
    languageTo: String,
});

module.exports = mongoose.model('LanguageTranslation', languageTranslationSchema);