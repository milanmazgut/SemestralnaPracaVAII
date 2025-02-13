using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SemestralnaPraca.Server.Migrations
{
    /// <inheritdoc />
    public partial class orderTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Adress",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "OrderStates",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderStates", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "OrdersDb",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    StateId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrdersDb", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrdersDb_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrdersDb_OrderStates_StateId",
                        column: x => x.StateId,
                        principalTable: "OrderStates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ItemsDb",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderId = table.Column<int>(type: "int", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Parameter = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemsDb", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ItemsDb_OrdersDb_OrderId",
                        column: x => x.OrderId,
                        principalTable: "OrdersDb",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ItemsDb_ProductsDb_ProductId",
                        column: x => x.ProductId,
                        principalTable: "ProductsDb",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ItemsDb_OrderId",
                table: "ItemsDb",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemsDb_ProductId",
                table: "ItemsDb",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_OrdersDb_StateId",
                table: "OrdersDb",
                column: "StateId");

            migrationBuilder.CreateIndex(
                name: "IX_OrdersDb_UserId",
                table: "OrdersDb",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ItemsDb");

            migrationBuilder.DropTable(
                name: "OrdersDb");

            migrationBuilder.DropTable(
                name: "OrderStates");

            migrationBuilder.DropColumn(
                name: "Adress",
                table: "AspNetUsers");
        }
    }
}
