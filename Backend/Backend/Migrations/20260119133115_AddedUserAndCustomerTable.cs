using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddedUserAndCustomerTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Users",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(2026, 1, 19, 17, 31, 14, 911, DateTimeKind.Local).AddTicks(4770),
                oldClrType: typeof(DateTime),
                oldType: "TEXT",
                oldDefaultValue: new DateTime(2026, 1, 16, 13, 47, 58, 281, DateTimeKind.Local).AddTicks(8327));

            migrationBuilder.AddColumn<string>(
                name: "Token",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Products",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(2026, 1, 19, 17, 31, 14, 910, DateTimeKind.Local).AddTicks(9182),
                oldClrType: typeof(DateTime),
                oldType: "TEXT",
                oldDefaultValue: new DateTime(2026, 1, 16, 13, 47, 58, 281, DateTimeKind.Local).AddTicks(828));

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "DeletedAt", "Password", "Token", "UpdatedAt", "Username" },
                values: new object[] { 1L, new DateTime(2026, 1, 19, 17, 31, 14, 911, DateTimeKind.Local).AddTicks(6569), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "123456", "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "polad" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1L);

            migrationBuilder.DropColumn(
                name: "Token",
                table: "Users");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Users",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(2026, 1, 16, 13, 47, 58, 281, DateTimeKind.Local).AddTicks(8327),
                oldClrType: typeof(DateTime),
                oldType: "TEXT",
                oldDefaultValue: new DateTime(2026, 1, 19, 17, 31, 14, 911, DateTimeKind.Local).AddTicks(4770));

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Products",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(2026, 1, 16, 13, 47, 58, 281, DateTimeKind.Local).AddTicks(828),
                oldClrType: typeof(DateTime),
                oldType: "TEXT",
                oldDefaultValue: new DateTime(2026, 1, 19, 17, 31, 14, 910, DateTimeKind.Local).AddTicks(9182));
        }
    }
}
