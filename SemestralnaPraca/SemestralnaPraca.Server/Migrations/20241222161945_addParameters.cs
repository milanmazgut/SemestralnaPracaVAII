using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SemestralnaPraca.Server.Migrations
{
    /// <inheritdoc />
    public partial class addParameters : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "NumberOfParameters",
                table: "ProductsDb",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NumberOfParameters",
                table: "ProductsDb");
        }
    }
}
