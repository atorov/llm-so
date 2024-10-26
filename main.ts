import { assertEquals } from "@std/assert";
import { Ajv } from "ajv";
import type { Result } from "./types.ts";

type CompletionResponse = Partial<{
    model: string;
    created_at: string;
    response: string;
    done: boolean;
    context: number[];
    total_duration: number;
    load_duration: number;
    prompt_eval_count: number;
    prompt_eval_duration: number;
    eval_count: number;
    eval_duration: number;
}>;

if (import.meta.main) {
    const timestamp = Date.now();

    const ajv = new Ajv();

    for (const model of [
        // # llama3.2
        "llama3.2:1b",
        "llama3.2:3b",

        // # gemma2
        "gemma2:2b",
        "gemma2:9b",
        "gemma2:27b",

        // # qwen2.5
        "qwen2.5:0.5b",
        "qwen2.5:1.5b",
        "qwen2.5:3b",
        "qwen2.5:7b",
        "qwen2.5:14b",
        "qwen2.5:32b",
        "qwen2.5:72b",

        // # phi3.5
        "phi3.5:3b",

        // # nomotron-mini
        "nomotron-mini:4b",

        // # mistral-small
        "mistral-small:22b",

        // # mistral-nemo
        "mistral-nemo:12b",

        // # deepseek-coder-v2
        "deepseek-coder-v2:16b",
        "deepseek-coder-v2:23b",

        // # mistral
        "mistral:7b",

        // # mixtral
        "mixtral:8x7b",

        // # codegemma
        "codegemma:2b",
        "codegemma:7b",

        // # command-r
        "command-r:35b",

        // # llava
        "llava:7b",
        "llava:13b",
        "llava:34b",

        // # starcoder2
        "starcoder2:3b",
        "starcoder2:7b",
    ]) {
        for (const testCase of [
            {
                difficultyLevel: 1,
                expectedResult: {
                    name: "Alice",
                    email: "alice@example.com",
                    age: 28,
                    is_active: true,
                },
                schema: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                        },
                        email: {
                            type: "string",
                        },
                        age: {
                            type: "integer",
                        },
                        is_active: {
                            type: "boolean",
                        },
                    },
                    required: ["name", "email", "age", "is_active"],
                },
                example: {
                    name: "John",
                    email: "john@test.com",
                    age: 42,
                    is_active: false,
                },
                description: `
                - name: Alice
                - age: 28
                - email: alice@example.com
                - active customer: true
                `,
            },
            {
                difficultyLevel: 2,
                expectedResult: {
                    id: 101,
                    name: "Wireless Mouse",
                    category: {
                        id: 5,
                        name: "Electronics",
                    },
                    price: 29.99,
                    in_stock: true,
                    dimensions: {
                        width: 6.5,
                        height: 3.0,
                        depth: 1.5,
                    },
                    tags: ["wireless", "peripheral", "computer"],
                },
                schema: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer",
                        },
                        name: {
                            type: "string",
                        },
                        category: {
                            type: "object",
                            properties: {
                                id: {
                                    type: "integer",
                                },
                                name: {
                                    type: "string",
                                },
                            },
                            required: ["id", "name"],
                        },
                        price: {
                            type: "number",
                        },
                        in_stock: {
                            type: "boolean",
                        },
                        dimensions: {
                            type: "object",
                            properties: {
                                width: {
                                    type: "number",
                                },
                                height: {
                                    type: "number",
                                },
                                depth: {
                                    type: "number",
                                },
                            },
                            required: ["width", "height", "depth"],
                        },
                        tags: {
                            type: "array",
                            items: {
                                type: "string",
                            },
                        },
                    },
                    required: ["id", "name", "category", "price", "in_stock", "dimensions"],
                },
                example: {
                    id: 1,
                    name: "Wireless Keyboard",
                    category: {
                        id: 2,
                        name: "Peripherals",
                    },
                    price: 39.99,
                    in_stock: false,
                    dimensions: {
                        width: 7.5,
                        height: 2.5,
                        depth: 1.0,
                    },
                    tags: ["wireless", "keyboard", "computer", "peripheral"],
                },
                description: `
                Product name: "Wireless Mouse" with ID 101.
                The mouse is in the "Electronics" category, category has its own ID too, which is 5.
                The mouse costs $29.99, and it's available in stock right now.
                There are some tags for it, like “wireless,” “peripheral,” and “computer.”
                It's 6.5 units wide, 3 units tall, and 1.5 units deep.`,
            },
            {
                difficultyLevel: 3,
                expectedResult: {
                    order_id: 4567,
                    customer: {
                        customer_id: 789,
                        name: "John Doe",
                        email: "john.doe@example.com",
                        address: {
                            street: "123 Elm St",
                            city: "Metropolis",
                            postal_code: "12345",
                            country: "USA",
                        },
                    },
                    items: [
                        {
                            product_id: 101,
                            name: "Wireless Mouse",
                            quantity: 2,
                            price_per_unit: 29.99,
                        },
                        {
                            product_id: 202,
                            name: "Keyboard",
                            quantity: 1,
                            price_per_unit: 49.99,
                        },
                    ],
                    order_date: "2024-10-10",
                    shipping: {
                        method: "Express",
                        cost: 9.99,
                        estimated_delivery_date: "2024-10-12",
                    },
                    total_price: 119.96,
                    status: "Shipped",
                },
                schema: {
                    type: "object",
                    properties: {
                        order_id: {
                            type: "integer",
                        },
                        customer: {
                            type: "object",
                            properties: {
                                customer_id: {
                                    type: "integer",
                                },
                                name: {
                                    type: "string",
                                },
                                email: {
                                    type: "string",
                                },
                                address: {
                                    type: "object",
                                    properties: {
                                        street: {
                                            type: "string",
                                        },
                                        city: {
                                            type: "string",
                                        },
                                        postal_code: {
                                            type: "string",
                                        },
                                        country: {
                                            type: "string",
                                        },
                                    },
                                    required: ["street", "city", "postal_code", "country"],
                                },
                            },
                            required: ["customer_id", "name", "email", "address"],
                        },
                        items: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    product_id: {
                                        type: "integer",
                                    },
                                    name: {
                                        type: "string",
                                    },
                                    quantity: {
                                        type: "integer",
                                    },
                                    price_per_unit: {
                                        type: "number",
                                    },
                                },
                                required: ["product_id", "name", "quantity", "price_per_unit"],
                            },
                        },
                        order_date: {
                            type: "string",
                        },
                        shipping: {
                            type: "object",
                            properties: {
                                method: {
                                    type: "string",
                                },
                                cost: {
                                    type: "number",
                                },
                                estimated_delivery_date: {
                                    type: "string",
                                },
                            },
                            required: ["method", "cost", "estimated_delivery_date"],
                        },
                        total_price: {
                            type: "number",
                        },
                        status: {
                            type: "string",
                        },
                    },
                    required: ["order_id", "customer", "items", "order_date", "shipping", "total_price", "status"],
                },
                example: {
                    order_id: 1234,
                    customer: {
                        customer_id: 567,
                        name: "Jane Doe",
                        email: "j.doe@example.com",
                        address: {
                            street: "456 Oak St",
                            city: "Gotham",
                            postal_code: "54321",
                            country: "Canada",
                        },
                    },
                    items: [
                        {
                            product_id: 303,
                            name: "Monitor",
                            quantity: 1,
                            price_per_unit: 199.99,
                        },
                        {
                            product_id: 404,
                            name: "Printer",
                            quantity: 1,
                            price_per_unit: 99.99,
                        },
                    ],
                    order_date: "2024-11-10",
                    shipping: {
                        method: "Standard",
                        cost: 4.99,
                        estimated_delivery_date: "2024-11-12",
                    },
                    total_price: 304.97,
                    status: "Delivered",
                },
                description: `
                The below text comes from a scanned order form:
                Order ID: 4567.
                Customer: John Doe (id 789) | Address: 123 Elm St, in Metropolis, USA, zip: 12345 | Email: john.doe@example.com
                Order products:
                - Wireless Mouse (id 101) | Price: $29.99 each | Qty: 2
                - Keyboard (id 202) | Price: $49.99 | Qty: 1
                Date: 2024-10-10
                Estimated delivery date: 2024-10-12
                Additional notes: Express shipping, $9.99
                --------------------------------
                Total: $119.96
                Order status: Shipped`,
            },
            {
                difficultyLevel: 4,
                expectedResult: {
                    research_project: {
                        title: "Advanced Computational Methods",
                        lead_scientist: {
                            name: "John Atanasov",
                            institution: "Institute of Computational Science",
                            contact: {
                                email: "atanasov.john@icscience.org",
                                phone: "+123456789",
                            },
                        },
                        team_members: [
                            {
                                name: "Dr. Alice Smith",
                                role: "Data Scientist",
                                email: "alice.smith@icscience.org",
                            },
                            {
                                name: "Dr. Bob Johnson",
                                role: "Mathematician",
                                email: "bob.johnson@icscience.org",
                            },
                        ],
                        funding: {
                            source: "National Science Foundation",
                            amount: 500000,
                            currency: "USD",
                        },
                        milestones: [
                            {
                                description: "Develop initial algorithms",
                                due_date: "2024-11-01",
                                status: "Completed",
                            },
                            {
                                description: "Test algorithms with real-world data",
                                due_date: "2025-01-15",
                                status: "In Progress",
                            },
                        ],
                        related_publications: [
                            {
                                title: "Foundations of Computational Methods",
                                journal: "Journal of Computational Science",
                                date_published: "2023-06-20",
                            },
                            {
                                title: "Real-world Applications of Algorithms",
                                journal: "Advanced Mathematics Review",
                                date_published: "2024-02-14",
                            },
                        ],
                    },
                },
                schema: {
                    type: "object",
                    properties: {
                        research_project: {
                            type: "object",
                            properties: {
                                title: {
                                    type: "string",
                                },
                                lead_scientist: {
                                    type: "object",
                                    properties: {
                                        name: {
                                            type: "string",
                                        },
                                        institution: {
                                            type: "string",
                                        },
                                        contact: {
                                            type: "object",
                                            properties: {
                                                email: {
                                                    type: "string",
                                                },
                                                phone: {
                                                    type: "string",
                                                },
                                            },
                                            required: ["email", "phone"],
                                        },
                                    },
                                    required: ["name", "institution", "contact"],
                                },
                                team_members: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            name: {
                                                type: "string",
                                            },
                                            role: {
                                                type: "string",
                                            },
                                            email: {
                                                type: "string",
                                            },
                                        },
                                        required: ["name", "role", "email"],
                                    },
                                },
                                funding: {
                                    type: "object",
                                    properties: {
                                        source: {
                                            type: "string",
                                        },
                                        amount: {
                                            type: "number",
                                        },
                                        currency: {
                                            type: "string",
                                        },
                                    },
                                    required: ["source", "amount", "currency"],
                                },
                                milestones: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            description: {
                                                type: "string",
                                            },
                                            due_date: {
                                                type: "string",
                                            },
                                            status: {
                                                type: "string",
                                            },
                                        },
                                        required: ["description", "due_date", "status"],
                                    },
                                },
                                related_publications: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            title: {
                                                type: "string",
                                            },
                                            journal: {
                                                type: "string",
                                            },
                                            date_published: {
                                                type: "string",
                                            },
                                        },
                                        required: ["title", "journal", "date_published"],
                                    },
                                },
                            },
                            required: [
                                "title",
                                "lead_scientist",
                                "team_members",
                                "funding",
                                "milestones",
                                "related_publications",
                            ],
                        },
                    },
                },
                example: {
                    research_project: {
                        title: "Advanced Machine Learning Techniques",
                        lead_scientist: {
                            name: "Dr. Jane Smith",
                            institution: "Institute of Machine Learning",
                            contact: {
                                email: "js@example.com",
                                phone: "+987654321",
                            },
                        },
                        team_members: [
                            {
                                name: "Yuki Tanaka, PhD",
                                role: "Mathematician",
                                email: "yt@example.com",
                            },
                        ],
                        funding: {
                            source: "National Institutes of Health",
                            amount: 750000,
                            currency: "EUR",
                        },
                        milestones: [
                            {
                                description: "Research and analyze existing algorithms",
                                due_date: "2025-03-01",
                                status: "In Progress",
                            },
                        ],
                        related_publications: [
                            {
                                title: "Machine Learning in Healthcare",
                                journal: "Health Informatics Journal",
                                date_published: "2024-09-15",
                            },
                        ],
                    },
                },
                description: `
                So, we’re looking at a research project here. \
                The project is called "Advanced Computational Methods," and it’s led by John Atanasov. \
                He’s from the Institute of Computational Science. \
                If you wanted to get in touch with him, you’d email him at atanasov.john@icscience.org or call him at +123456789.
                The team working with him includes Dr. Alice Smith (email: alice.smith@icscience.org), who is a Data Scientist, and Dr. Bob Johnson (bob.johnson@icscience.org), a Mathematician.
                Their project is funded by the National Science Foundation, with a grant of $500,000 in US dollars.
                Now, they’ve got a couple of important milestones.
                The first one, titled "Develop initial algorithms", was to develop the initial algorithms, which was due on November 1st, 2024, and has already been completed.
                The next milestone, called "Test algorithms with real-world data", is testing those algorithms with real-world data, which is due by January 15th, 2025, and they’re still working on it.
                There have also been some publications related to this project, like one titled "Foundations of Computational Methods" that came out in June 20th, 2023 (Journal of Computational Science), \
                and another one called "Real-world Applications of Algorithms" from February 14h, 2024 (Advanced Mathematics Review).
                `,
            },
            {
                difficultyLevel: 5,
                expectedResult: {
                    university_program: {
                        name: "Artificial Intelligence and Robotics",
                        institution: {
                            name: "University of Advanced Technologies",
                            location: {
                                city: "Sofia",
                                country: "Bulgaria",
                                building: "Tech Hub",
                                room: null,
                            },
                        },
                        head_of_program: {
                            name: "Dr. Ivan Georgiev",
                            contact: {
                                email: "ivan.georgiev@uatbg.mock",
                                phone: "+35912345678",
                            },
                        },
                        courses: [
                            {
                                title: "Introduction to Artificial Intelligence",
                                credits: 6,
                                lecturer: {
                                    name: "Prof. Elena Dimitrova",
                                    email: "elena.dimitrova@uatbg.mock",
                                },
                            },
                            {
                                title: "Robotics Systems Design",
                                credits: 8,
                                lecturer: {
                                    name: "Assoc. Prof. Stefan Petrov",
                                    email: "stefan.petrov@uatbg.mock",
                                },
                            },
                        ],
                        enrollment: {
                            start_date: "2024-09-01",
                            end_date: "2024-09-30",
                            total_students: 150,
                            open_for_international_students: true,
                        },
                        tuition_fees: {
                            local_students: 4000.5,
                            international_students: 8000.75,
                            currency: "BGN",
                        },
                        scholarships_available: true,
                        partner_companies: ["RoboTech Innovations", "AI Labs Bulgaria", "TechFuture Ltd."],
                        latest_news: [
                            {
                                title: "New AI Lab Opened at UAT",
                                date: "2024-03-15",
                                content:
                                    "The University of Advanced Technologies has opened a new state-of-the-art AI research lab, offering students hands-on experience.",
                            },
                            {
                                title: "Collaboration with AI Labs Bulgaria",
                                date: "2024-04-25",
                                content:
                                    "UAT announced a new partnership with AI Labs Bulgaria to collaborate on AI research and development projects.",
                            },
                        ],
                        program_active: true,
                    },
                },
                schema: {
                    type: "object",
                    properties: {
                        university_program: {
                            type: "object",
                            properties: {
                                name: {
                                    type: "string",
                                },
                                institution: {
                                    type: "object",
                                    properties: {
                                        name: {
                                            type: "string",
                                        },
                                        location: {
                                            type: "object",
                                            properties: {
                                                city: {
                                                    type: "string",
                                                },
                                                country: {
                                                    type: "string",
                                                },
                                                building: {
                                                    type: "string",
                                                },
                                                room: {
                                                    type: ["string", "null"],
                                                },
                                            },
                                            required: ["city", "country", "building", "room"],
                                        },
                                    },
                                    required: ["name", "location"],
                                },
                                head_of_program: {
                                    type: "object",
                                    properties: {
                                        name: {
                                            type: "string",
                                        },
                                        contact: {
                                            type: "object",
                                            properties: {
                                                email: {
                                                    type: "string",
                                                },
                                                phone: {
                                                    type: "string",
                                                },
                                            },
                                            required: ["email", "phone"],
                                        },
                                    },
                                    required: ["name", "contact"],
                                },
                                courses: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            title: {
                                                type: "string",
                                            },
                                            credits: {
                                                type: "integer",
                                            },
                                            lecturer: {
                                                type: "object",
                                                properties: {
                                                    name: {
                                                        type: "string",
                                                    },
                                                    email: {
                                                        type: "string",
                                                    },
                                                },
                                                required: ["name", "email"],
                                            },
                                        },
                                        required: ["title", "credits", "lecturer"],
                                    },
                                },
                                enrollment: {
                                    type: "object",
                                    properties: {
                                        start_date: {
                                            type: "string",
                                        },
                                        end_date: {
                                            type: "string",
                                        },
                                        total_students: {
                                            type: "integer",
                                        },
                                        open_for_international_students: {
                                            type: "boolean",
                                        },
                                    },
                                    required: [
                                        "start_date",
                                        "end_date",
                                        "total_students",
                                        "open_for_international_students",
                                    ],
                                },
                                tuition_fees: {
                                    type: "object",
                                    properties: {
                                        local_students: {
                                            type: "number",
                                        },
                                        international_students: {
                                            type: "number",
                                        },
                                        currency: {
                                            type: "string",
                                        },
                                    },
                                    required: ["local_students", "international_students", "currency"],
                                },
                                scholarships_available: {
                                    type: "boolean",
                                },
                                partner_companies: {
                                    type: "array",
                                    items: {
                                        type: "string",
                                    },
                                },
                                latest_news: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            title: {
                                                type: "string",
                                            },
                                            date: {
                                                type: "string",
                                            },
                                            content: {
                                                type: "string",
                                            },
                                        },
                                        required: ["title", "date", "content"],
                                    },
                                },
                                program_active: {
                                    type: "boolean",
                                },
                            },
                            required: [
                                "name",
                                "institution",
                                "head_of_program",
                                "courses",
                                "enrollment",
                                "tuition_fees",
                                "scholarships_available",
                                "partner_companies",
                                "latest_news",
                                "program_active",
                            ],
                        },
                    },
                },
                example: {
                    university_program: {
                        name: "Machine Learning and Data Science",
                        institution: {
                            name: "University of Technology",
                            location: {
                                city: "New York",
                                country: "USA",
                                building: "Tech Center",
                                room: null,
                            },
                        },
                        head_of_program: {
                            name: "Dr. Jane Doe",
                            contact: {
                                email: "jd@example.mock",
                                phone: "+1234567890",
                            },
                        },
                        courses: [
                            {
                                title: "Data Mining",
                                credits: 4,
                                lecturer: {
                                    name: "Prof. Alex Johnson",
                                    email: "aj@example.mock",
                                },
                            },
                        ],
                        enrollment: {
                            start_date: "2025-06-01",
                            end_date: "2025-06-30",
                            total_students: 100,
                            open_for_international_students: true,
                        },
                        tuition_fees: {
                            local_students: 5000.0,
                            international_students: 10000.0,
                            currency: "USD",
                        },
                        scholarships_available: true,
                        partner_companies: ["Tech Innovations Inc.", "Data Labs", "Future Tech Ltd."],
                        latest_news: [
                            {
                                title: "New Research Lab Opened",
                                date: "2025-03-15",
                                content:
                                    "The state-of-the-art research lab at the University of Technology is now open for students and faculty.",
                            },
                        ],
                        program_active: true,
                    },
                },
                description: `
                Note: The following is a fictional podcast transcript based on information about a university program in Artificial Intelligence and Robotics at the University of Advanced Technologies in Sofia, Bulgaria.
                Host: Welcome back to "Tech Education Spotlight," where we explore cutting-edge programs in technology and science. Today, we're diving into an exciting program at the University of Advanced Technologies in Sofia, Bulgaria. I'm joined by our education correspondent, Maria. Maria, what can you tell us about this program?
                Maria: Thanks, Alex. I've been looking into their "Artificial Intelligence and Robotics" program, and it's quite impressive. The program is led by Dr. Ivan Georgiev, who's really making waves in the field.
                Host: Interesting! How can our listeners get in touch with Dr. Georgiev if they want more information?
                Maria: Well, they can reach him via email at ivan.georgiev@uatbg.mock or give him a call at +35912345678. The program itself is housed in the Tech Hub building on campus, although I don't have a specific room number to share.
                Host: Got it. What about the courses? Any standouts?
                Maria: Absolutely. There are two key courses that caught my attention. First, there's "Introduction to Artificial Intelligence", 6 credits, taught by Prof. Elena Dimitrova. Then there's "Robotics Systems Design", 8 credits, led by Assoc. Prof. Stefan Petrov. What's interesting is that some courses are in-person, while others, like the robotics course, offer online options.
                Host: That's great for flexibility. Now, for our listeners who might be interested in applying, what's the enrollment process like?
                Maria: The enrollment period for the upcoming academic year is from September 1st to September 30th, 2024. They can accommodate up to 150 students, and it's open to both local and international students.
                Host: And what about tuition fees?
                Maria: Good question. Local students are looking at 4000.50 BGN, while international students will need to budget for 8000.75 BGN. But here's some good news - scholarships are available for eligible students.
                Host: That's helpful to know. Are there any industry connections or partnerships?
                Maria: Yes, and this is where it gets really exciting. The program has partnerships with companies like RoboTech Innovations, AI Labs Bulgaria, and TechFuture Ltd. In fact, they've recently opened a new AI research lab and are collaborating with AI Labs Bulgaria on some advanced projects.
                Host: Wow, sounds like students would get some great real-world experience. Is the program currently active?
                Maria: Yes, it is. It's up and running, and from what I've gathered, it's quite popular.
                Host: This sounds like an amazing opportunity for anyone interested in AI and robotics. Thanks for sharing all this information, Maria.
                Maria: My pleasure, Alex. It's always exciting to see these innovative programs in action.
                Host: Absolutely. And that wraps up our spotlight on the Artificial Intelligence and Robotics program at the University of Advanced Technologies in Sofia, Bulgaria. Thanks for tuning in to "Tech Education Spotlight." Until next time!
                [End of podcast transcript]
                # Show Notes
                ## 1. Recent News from University of Advanced Technologies (UAT)
                - **March 15, 2024: New AI Lab Opened at UAT**
                The University of Advanced Technologies has opened a new state-of-the-art AI research lab, offering students hands-on experience.
                - **April 25, 2024: Collaboration with AI Labs Bulgaria**
                UAT announced a new partnership with AI Labs Bulgaria to collaborate on AI research and development projects.
                ## 2. Key Courses
                ### Introduction to Artificial Intelligence
                - **Credits:** 6
                - **Lecturer:** Prof. Elena Dimitrova (elena.dimitrova@uatbg.mock)
                ### Robotics Systems Design
                - **Credits:** 8
                - **Lecturer:** Assoc. Prof. Stefan Petrov (stefan.petrov@uatbg.mock)`,
            },
        ]) {
            const promptText = `
            **Requirements**:  
            You are tasked with converting human-readable descriptions into structured JSON outputs. 
            - The data generated should adhere to the predefined schema and follow proper JSON formatting.
            - The result should be a valid JSON object that strictly conforms to the schema structure, including correct data types, field names, and values. 
            - The JSON output should include all required fields specified in the schema.
            - If a field is specified as required in the schema but the data for it is not provided in the description, the field should not be omitted from the JSON output and should be set to a value that indicates its absence (e.g., null, an empty string, or an empty array) but with the correct data type.
            - Optional fields should be omitted where not applicable. 
            - If a field is specified as optional in the schema and data for it is not provided in the description, the field should be omitted from the JSON output.
            - Optional fields set as empty objects or empty arrays but with required fields inside according to the schema are not allowed.
            - The JSON should not include any additional fields that are not specified in the schema.
            - The output should only be the JSON object.
            - he output should be a valid JSON string and should not include any extra or undefined fields, comments, or any text outside of the JSON object.
            **Schema**: 
            \`\`\`json
            ${JSON.stringify(testCase.schema)}
            \`\`\`
            **Example JSON Output**:  
            \`\`\`json
            ${JSON.stringify(testCase.example)}
            \`\`\`
            **Human-Readable Description**:  
            "${JSON.stringify(testCase.description)}"`;
            // console.log("::: promptText:", promptText);

            for (let iteration = 1; iteration <= 10; iteration++) {
                console.log("\n===== Model:", model, "=====================");
                console.log("--- difficultyLevel:", testCase.difficultyLevel, "-------------------");
                console.log("--- iteration #", iteration, "-------------------");

                const { response: completion, total_duration } = await fetch("http://localhost:11434/api/generate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model,
                        prompt: promptText,
                        format: "json",
                        stream: false,
                        options: {
                            num_ctx: 1024 * 8,
                        },
                    }),
                })
                    .then((response) => response.json() as Promise<CompletionResponse>)
                    .catch((error) => {
                        console.error("::: Get completion error:", error);
                        return {} as CompletionResponse;
                    });

                // const trimmedCompletion = typeof completion === "string" ? completion.trim() : completion;
                // console.log("::: trimmedCompletion:", trimmedCompletion);

                let result: Record<string, unknown> | undefined = undefined;

                const validate = ajv.compile(testCase.schema);

                const validations = {
                    hasValidJsonFormat: false,
                    hasValidSchema: false,
                    hasValidData: false,
                };

                // Validate if the string is a valid JSON
                if (completion) {
                    try {
                        result = JSON.parse(completion.trim());
                        validations.hasValidJsonFormat = true;
                    } catch (error) {
                        console.warn("::: JSON parse error:", error);
                    }
                }

                // Validate if the JSON object adheres to the schema
                if (validations.hasValidJsonFormat) {
                    validations.hasValidSchema = validate(result);
                    if (!validations.hasValidSchema) {
                        console.warn("::: Schema validation error:", validate.errors);
                    }
                }

                // Validate data
                if (validations.hasValidSchema) {
                    try {
                        assertEquals(
                            result,
                            testCase.expectedResult as Record<string, unknown> | Record<string, unknown>[]
                        );
                        validations.hasValidData = true;
                    } catch (error) {
                        console.warn("::: Data validation error:", error);
                    }
                }

                // console.log("::: Result:", result);

                console.log("::: Duration:", total_duration, "ns");
                console.log("::: validations:", validations);

                const absoluteScore = Object.entries(validations).reduce((acc, [key, value]) => {
                    if (key === "hasValidJsonFormat" && value) {
                        return acc + (value ? 10 : 0);
                    }
                    if (key === "hasValidSchema" && value) {
                        return acc + (value ? 30 : 0);
                    }
                    if (key === "hasValidData" && value) {
                        return acc + (value ? 60 : 0);
                    }
                    return acc;
                }, 0);
                console.log("::: Absolute score:", absoluteScore, "/ 100");

                const relativeScore = absoluteScore * testCase.difficultyLevel;
                console.log("::: Relative score:", relativeScore, `/ ${100 * testCase.difficultyLevel}`);

                const isSuccessful = Object.values(validations).every((value) => value);
                console.log("::: isSuccessful:", isSuccessful);

                const logData: Result = {
                    model,
                    difficultyLevel: testCase.difficultyLevel,
                    iteration,
                    duration: total_duration,
                    ...validations,
                    absoluteScore,
                    relativeScore,
                    isSuccessful,
                };
                const logDataStr = JSON.stringify(logData) + "\n";
                await Deno.writeTextFile(`results_${model}_${timestamp}.txt`, logDataStr, { append: true });

                // Delay before the next iteration to avoid overloading the API
                // await new Promise((resolve) => setTimeout(resolve, 2500));
            }
            // Delay before the next difficulty level to avoid overloading the API
            // await new Promise((resolve) => setTimeout(resolve, 5000));
        }
        // Delay before the next model to avoid overloading the API
        // await new Promise((resolve) => setTimeout(resolve, 10_000));
    }
}
