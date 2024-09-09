class Helper{
    static BsonToJsonConverter = (data) => {
        data = JSON.stringify(data);
        data = JSON.parse(data);
        return data;
      };
}
export default Helper;