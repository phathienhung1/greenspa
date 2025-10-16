public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = "";
    public string Password { get; set; } = ""; // hash nếu muốn
    public int BranchId { get; set; }
}
