using Microsoft.AspNetCore.Identity;

namespace SemestralnaPraca.Server.Identity
{
    public class SlovakIdentityErrorDescriber : IdentityErrorDescriber
    {
        public override IdentityError PasswordRequiresDigit()
        {
            return new IdentityError
            {
                Code = nameof(PasswordRequiresDigit),
                Description = "Heslo musí obsahovať aspoň jednu číslicu (0-9).\n"
            };
        }

        public override IdentityError PasswordRequiresLower()
        {
            return new IdentityError
            {
                Code = nameof(PasswordRequiresLower),
                Description = "Heslo musí obsahovať aspoň jedno malé písmeno (a-z).\n"
            };
        }

        public override IdentityError PasswordRequiresUpper()
        {
            return new IdentityError
            {
                Code = nameof(PasswordRequiresUpper),
                Description = "Heslo musí obsahovať aspoň jedno veľké písmeno (A-Z).\n"
            };
        }

        public override IdentityError PasswordRequiresNonAlphanumeric()
        {
            return new IdentityError
            {
                Code = nameof(PasswordRequiresNonAlphanumeric),
                Description = "Heslo musí obsahovať aspoň jeden špeciálny znak (napr. !, @, #, $, %).\n"
            };
        }

        public override IdentityError PasswordTooShort(int length)
        {
            return new IdentityError
            {
                Code = nameof(PasswordTooShort),
                Description = $"Heslo musí mať aspoň {length} znakov.\n"
            };
        }

        public override IdentityError DuplicateUserName(string userName)
        {
            return new IdentityError
            {
                Code = nameof(DuplicateUserName),
                Description = $"Email '{userName}' je už registrovaný."
            };
        }
    }
}
