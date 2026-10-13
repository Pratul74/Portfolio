const skills = [

    "FastAPI",

    "Redis",

    "Docker",

    "RabbitMQ",

    "PostgreSQL",

    "Celery",

    "JWT",

    "AWS"

];

export default function TechStack(){

    return(

        <div className="mt-10 flex flex-wrap gap-3 self-auto">

            {

                skills.map(skill=>(

                    <div

                        key={skill}

                        className="border border-orange-600 px-4 py-2 text-sm hover:bg-orange-500 hover:text-black"

                    >

                        {skill}

                    </div>

                ))

            }

        </div>

    )

}